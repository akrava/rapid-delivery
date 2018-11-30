const express = require('express'),
    User = require('../models/user'),
    Service = require('../scripts/service'),
    config = require('../config');

const router = express.Router();

router.get('/', Service.checkAdmin, async (req, res) => {
    let users = null;
    try {
        users = await User.getAll();
        if (!Array.isArray(users)) throw new Error("Error while loading users from db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Couldn't load users from db`, err.message);
    }
    users = users.filter(user => user.isDisabled === false);
    users.forEach(user => {
        user.registeredAt = user.registered.toFormatedString();
    });
    res.render('users', {
        title: "Користувачі",
        usersPage: true,
        users
    });
});

router.get('/me', Service.checkAuth, (req, res) => {
    if (req.user) {
        req.params.login = req.user.login;
        userRenderPage(req, res);
    } else {
        Service.sendErrorPage(500, 'Server Error');
    }
});

router.get('/:login(\[A-Za-z_0-9]+)', Service.checkAdmin, (req, res) => {
    res.locals.chageRole = req.params.login !== req.user.login;
    userRenderPage(req, res);
});

async function userRenderPage(req, res) {
    const loginString = req.params.login;
    if (!loginString.trim()) return Service.sendErrorPage(res, 400, `Requested login is empty`);
    let user = null;
    try {
        user = await User.getByLogin(loginString);
    } catch (err) {
        return Service.sendErrorPage(res, 400, `Couldn't load user login=${loginString} from db`, err.message);
    }
    if (user) {
        user.registeredAt = new Date(user.registered).toFormatedString();
        user.totalInvoices = 0;
        user.registries.forEach(x => {
            user.totalInvoices += x.invoices.length;
        });
        return res.render('user', {
            title: `${user.fullname} - обліковий запис користувача`,
            user,
            changeInfo: req.user.id.toString() === user.id.toString()
        });
    } else {
        return Service.sendErrorPage(res, 404, `Not found requested user in db`, 
            `Such user with login ${loginString} not found`);
    }
}

router.post('/changeRole', Service.checkAdmin, async (req, res) => {
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const userID = req.body.id;
    const roleString = req.body.role;
    const role = Number.parseInt(roleString);
    if (!Number.isInteger(role)) return Service.sendErrorPage(res, 400, `Bad request`);
    if (role !== 0 && role !== 1) return Service.sendErrorPage(res, 400, `Bad request`);
    let user = null;
    try {
        user = await User.getById(userID);
        if (!user) return Service.sendErrorPage(res, 400, `No such user`);
        user.role = role;
        await User.update(user);
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Error while adding registry`, err.message);
    }
    res.redirect(`/users/${user.login}`);
});

router.post('/edit', Service.checkAuth, async (req, res) => {
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const userID = req.body.id;
    let user = null;
    try {
        user = await User.getById(userID);
        if (!user) return Service.sendErrorPage(res, 400, `No such user`);
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Error while adding registry`, err.message);
    }
    return res.render('editUser', {
        title: `Редагування профілю`,
        user,
        chageRole: req.user.role === Service.roleAdmin && user.login !== req.user.login
    });
});

router.post('/update', Service.checkAuth, async (req, res) => {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegExPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const phoneRegExPattern = /\+380[0-9]{9}/;
    if (!req.body) Service.sendErrorPage(res, 400, `Bad request`);
    const userID = req.body.id;
    if (userID !== req.user.id.toString()) return Service.sendErrorPage(res, 403, `Forbidden`);
    const pasword = req.body.pasw;
    if (!pasword) return Service.sendErrorPage(res, 400, `Bad request`);
    else if (pasword.length < 8 || pasword.length > 30) return Service.sendErrorPage(res, 400, `Bad request`);
    const fullname = req.body.fullname ? req.body.fullname.trim() : null;
    if (!fullname || fullname.length < 3 || fullname.length > 30) return Service.sendErrorPage(res, 400, `Bad request`);
    const email = req.body.email ? req.body.email.toLowerCase().trim() : null;
    if (!email || !email.match(emailRegExPattern)) return Service.sendErrorPage(res, 400, `Bad request`);
    const phone = req.body.phone ? req.body.phone.trim() : null;
    if (!phone || !phone.match(phoneRegExPattern)) return Service.sendErrorPage(res, 400, `Bad request`);
    const bio = req.body.bio ? req.body.bio.trim() : '';
    if (bio && bio.length > 1000) return Service.sendErrorPage(res, 400, `Bad request`);
    const photo = req.files ? req.files.photo : null;
    // https://regex101.com/codegen?language=javascript
    const fileRegExPattern = /(\.[a-zA-Z]+)/g;
    if ((photo && (photo.truncated || !photo.mimetype.startsWith(`image/`)))) {
        return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    }
    let photoExt = null;
    if (photo) {
        photoExt = photo.name.lastIndexOf('.') < 0 ? "" : photo.name.substr(photo.name.lastIndexOf('.'));
        if (!photoExt.match(fileRegExPattern)) return Service.sendErrorPage(res, 400, `File extenrion is invalid`);
    }
    try {
        const user = await User.getById(userID);
        if (user.password !== Service.sha512(pasword, config.SaltHash)) {
            return Service.sendErrorPage(res, 403, `Forbidden`, 'password doesn\'t match');
        }
        user.fullname = fullname;
        user.email = email;
        user.phone = phone;
        if (bio) user.bio = bio;
        else if (bio === '') user.bio = null;
        await User.update(user);
        if (photo) {
            await user.deleteAvatarFromStorage();
            await user.loadAvatarToStorage(photo.data);
        } 
    } catch (err) {
        return Service.sendErrorPage(res, 400, `Couldn't update user`, err.message);
    }
    res.redirect(`/users/me`); 
});

module.exports = router;