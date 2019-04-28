const express = require('express'),
    mongoose = require('mongoose'),
    urlencodedBodyParser = require('body-parser'),
    bodyParser = require('busboy-body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportJWT = require('passport-jwt'),
    path = require('path'),
    config = require('./config'),
    Service = require('./scripts/service'),
    AuthModule = require('./routes/auth'),
    ApiRoutes = require('./routes/api');

if (config.TelegramBotEnable === "true") {
    require('./src/telegram_bot/index'); 
}
   
const app = express();
const PORT = config.ServerPort;

const databaseUrl = config.DatabaseUrl;
const connectionsOptions = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

app.use(express.static('public'));
app.use(bodyParser({ limit: '3mb' }));
app.use(urlencodedBodyParser.urlencoded({ extended: false }));
app.use(urlencodedBodyParser.json());
app.use(session({
    secret: config.SecretSession,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(databaseUrl, connectionsOptions)
    .then(() => console.log(`Opened connection wih db: ${databaseUrl}`))
    .then(() => app.listen(PORT, () => console.log('Server started at port:', PORT)))
    .catch(err => console.error('An error ocurred while startting web-server: ', err.message));

passport.serializeUser(AuthModule.serializeUser);
passport.deserializeUser(AuthModule.deserializeUser);
passport.use(new LocalStrategy({ usernameField: 'login' }, AuthModule.verifiyUserFunction));
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.SecretSession
    }, AuthModule.getUserFromToken
));

app.use('/auth', AuthModule.router);
app.use('/api/v1', ApiRoutes);
app.use(express.static('dist'));
app.get('*', (_req, res) =>{
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.use((err, _req, res) => {
    console.error(err.stack);
    Service.sendErrorPage(res, 500, `Internal srever error`, err.message);
});