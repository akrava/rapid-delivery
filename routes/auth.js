const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    url = require('url'),
    config = require('./../config'),
    User = require('./../models/user'),
    Service = require('./../scripts/service');

const router = express.Router();

router.post('/register', async (req, res) => {
    const errorRedirect = name => `/auth/register/${url.format({query: {error: encodeURIComponent(name)}})}`;
    const loginRegExPattern = /[A-Za-z_0-9]{5,20}/;
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegExPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const phoneRegExPattern = /\+380[0-9]{9}/;
    if (!req.body) {
        return res.redirect(errorRedirect(`Invalid request data in body`));
    }
    const login = req.body.login;
    if (!login || !login.match(loginRegExPattern)) return res.redirect(errorRedirect(`Invalid login`));
    const pasword = req.body.pasw;
    const pasword_dup = req.body.confirm_pasw;
    if (!pasword || pasword !== pasword_dup) return res.redirect(errorRedirect('Паролі не співпадають'));
    else if (pasword.length < 8 || pasword.length > 30) return res.redirect(errorRedirect('Invalid password'));
    const fullname = req.body.fullname ? req.body.fullname.trim() : null;
    if (!fullname || fullname.length < 3 || fullname.length > 30) return res.redirect(errorRedirect('Invalid fullname. Приберіть пробіли спочатку та скінця'));
    const email = req.body.email ? req.body.email.toLowerCase().trim() : null;
    if (!email || !email.match(emailRegExPattern)) return res.redirect(errorRedirect('Invalid email'));
    const phone = req.body.phone ? req.body.phone.trim() : null;
    if (!phone || !phone.match(phoneRegExPattern)) return res.redirect(errorRedirect('Invalid phone'));
    const user = new User(-1, login, Service.sha512(pasword, config.SaltHash), 
        Service.roleStandart, fullname, email, phone);
    try {
        const userSameLogin = User.getByLogin(login);
        if (await userSameLogin) {
            return res.redirect(errorRedirect('Користувач з таким логіном вже існує. Виберіть інший'));
        }
        await User.insert(user);
    } catch (e) {
        return Service.sendErrorPage(res, 500, 'Error accessing to db', e.message);
    }
    res.redirect(`/auth/login/${url.format({query: {inform: encodeURIComponent('Успішно створено!')}})}`);
});

router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (user === false) {
            return res.status(401).send({
                message: `Username or password doesn't match`
            });
        } else if (err || !user) {
            return res.status(400).send({
                message: `Something is not right: ${err}`
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) { return res.send(err); }
            // generate a signed json web token with the contents of user object
            const token = jwt.sign({id: user.id}, config.SecretSession);
            cleanSensetiveUserInfo(user);
            return res.json({ user, token });
        }); 
    })(req, res);
});

router.post('/logout', Service.checkAuth, (req, res) => {
    req.logout();   
    res.redirect('/');
});

function cleanSensetiveUserInfo(user) {
    delete user.id;
    delete user.password;
    delete user.isDisabled;
    delete user.telegramUsername;
    delete user.telegramUserId;
    delete user.telegramNotifySilent;
    user.upcomingInvoices.forEach(x => {
        delete x.id;
        delete x.recipient;
    });
    user.registries.forEach(x => delete x.id);
}

async function getUserFromToken(jwtPayload, cb) {
    if (!jwtPayload || !jwtPayload.id) return cb(new Error("Couldn't get id from tocken"), null);
    let user = null;
    try {
        user = await User.getById(jwtPayload.id);
    } catch (e) {
        return cb(e, null);
    }
    if (!user) {
        cb(null, false);
    } else {
        cb(null, user);
    }
}

async function verifiyUserFunction(username, password, done) {
    let user = null;
    try {
        user = await User.getByLogin(username);
    } catch (e) {
        return done(e, null);
    }
    if (!user) {
        done(null, false);
    } else if (user.password === Service.sha512(password, config.SaltHash)) {
        done(null, user);
    } else {
        done(null, false);
    }
}

function serializeUser(user, done) {
    if (user && user.id && user.id instanceof mongoose.mongo.ObjectID) {
        done(null, user.id.toString());
    } else {
        done(new Error("Couldn't get id of user"), null);
    }
}

async function deserializeUser(id, done) {
    let user = null;
    try {
        user = await User.getById(id);
    } catch (e) {
        return done(e, null);
    }
    if (!user) done(new Error("Such user not found"), null);
    else done(null, user);
}

module.exports = {
    serializeUser,
    deserializeUser,
    verifiyUserFunction,
    getUserFromToken,
    router
};