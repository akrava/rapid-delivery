const express = require('express'),
    mongoose = require('mongoose'),
    mustache = require('mustache-express'),
    urlencodedBodyParser = require('body-parser'),
    bodyParser = require('busboy-body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    path = require('path'),
    config = require('./config'),
    Service = require('./scripts/service'),
    AuthRouter = require('./routes/auth'),
    UsersRouter = require('./routes/users'),
    RegistriesRouter = require('./routes/registries'),
    InvoicesRouter = require('./routes/invoices'),
    ApiRoutes = require('./routes/api'),
    DeveloperRoutes = require('./routes/developer'),
    User = require('./models/user');

const app = express();
const PORT = config.ServerPort;
const templatesPath = path.join(__dirname, 'views');

const databaseUrl = config.DatabaseUrl;
const connectionsOptions = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

app.use(express.static('public'));
app.use(bodyParser({ limit: '3mb' }));
app.use(urlencodedBodyParser.urlencoded({ extended: false }));
app.use(urlencodedBodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: config.SecretSession,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('mst', mustache(path.join(templatesPath, 'partials')));
app.set('views',templatesPath);
app.set('view engine', 'mst');

mongoose.connect(databaseUrl, connectionsOptions)
    .then(() => console.log(`Opened connection wih db: ${databaseUrl}`))
    .then(() => app.listen(PORT, () => console.log('Server started at port:', PORT)))
    .catch(err => console.error('An error ocurred while startting web-server: ', err.message));

passport.serializeUser((user, done) => {
    if (user && user.id && user.id instanceof mongoose.mongo.ObjectID) {
        done(null, user.id.toString());
    } else {
        done(new Error("Couldn't get id of user"), null);
    }
});

passport.deserializeUser(async (id, done) => {
    let user = null;
    try {
        user = await User.getById(id);
    } catch (e) {
        return done(e, null);
    }
    if (!user) done(new Error("Such user not found"), null);
    else done(null, user);
});

passport.use(new LocalStrategy({ usernameField: 'login' }, verifiyUserFunction));
passport.use(new BasicStrategy(verifiyUserFunction));

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

// https://stackoverflow.com/questions/20912283/passport-js-passing-user-req-user-to-template-implicitly
app.use((req, res, next) => {
    res.locals.loginedUser = req.user;
    next();
});

// FILTER IP ADRESS ON PROD (DELETE LATER)
app.enable('trust proxy');
if (process.env['NODE_ENV'] === 'production'|| true) {
    app.use((req, res, next) => {
        console.log(new Error("Delete this handler on prod"));
        const trustedIps = [
            '93.72.233.118'
        ];
        for (let i = 0; i < 10; i++) {
            trustedIps.push(process.env[`ip_allowed_${i}`] || null);
        }
        const requestIP = req.connection.remoteAddress.slice(req.connection.remoteAddress.indexOf('ffff:') + 5);
        if (trustedIps.indexOf(requestIP) >= 0) {
            next();
        } else {
            res.status(403).end(`ip not allowed: ${requestIP}`);
        }
    });
}
// END FILTER IP ADRESS ON PROD

app.use('/auth', AuthRouter);
app.use('/users', UsersRouter);
app.use('/registries', RegistriesRouter);
app.use('/invoices', InvoicesRouter);
app.use('/api/v1', ApiRoutes);
app.use('/developer/v1', DeveloperRoutes);

app.get('/index', (req, res) => {
    res.redirect('/');
});

app.get('/index.html', (req, res) => {
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.render('index', {
        title: "Головна сторінка",
        indexPage: true
    });
}); 

app.get('/about', (req, res) => {
    res.render('about', {
        title: "Про компанію",
        breadcrumbs: [{text: 'Про компанію'}],
        aboutPage: true
    });
});

app.use((req, res) => {
    return Service.sendErrorPage(res, 404, `Page not found`, `Page ${req.path} not found`);
});

app.use((err, req, res) => {
    console.error(err.stack);
    return Service.sendErrorPage(res, 500, `Internal srever error`, err.message);
});
  
Date.prototype.toFormatedString = Service.toFormatedString;
Date.prototype.toValueHtmlString = Service.toValueHtmlString;