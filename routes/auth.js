const express = require('express'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    url = require('url'),
    config = require('./../config'),
    User = require('./../models/user'),
    Service = require('./../scripts/service');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register', {
        title: "Реєстрація нового користувача",
        breadcrumbs: [{text: 'Реєстрація'}],
        error: req.query.error ? decodeURIComponent(req.query.error) : false
    });
});

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

router.get('/login', async (req, res) => {
    res.render('login', {
        title: "Вхід на сайт",
        breadcrumbs: [{text: 'Вхід'}],
        error: req.query.error ? decodeURIComponent(req.query.error) : false,
        inform: req.query.inform ? decodeURIComponent(req.query.inform) : false
    });
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
    delete user.registries;
    delete user.upcomingInvoices;
    delete user.isDisabled;
}

module.exports = router;