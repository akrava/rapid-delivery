const express = require('express'),
    passport = require('passport'),
    url = require('url'),
    User = require('./../models/user'),
    Registry = require('./../models/registry'),
    Invoice = require('./../models/invoice'),
    Service = require('./../scripts/service'),
    config = require('./../config');

const router = express.Router();

function authenticate(req, res, next) {
    if (!req.user) { 
        const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });
        return jwtAuthMiddleware(req, res, next); 
    }
    next();
};

router.get('/', (req, res) => {
    res.send({links:[createLink("docs", "GET", "/developer/v1")]});
});

router.get('/me', authenticate, (req, res) => {
    let user = req.user;
    user = cleanSensetiveUserInfo(user);
    res.send(user);
});

// Invoices
router.get('/invoices', authenticate, async (req, res) => {
    const user = req.user;
    const limitString = req.query.limit;
    const pageString = req.query.page;
    const searchQueryString = req.query.query ? req.query.query.trim() : null;
    const searchTypeString = req.query.type;
    const authorLoginString = req.query.author ? req.query.author.trim() : null;
    const minQueryLength = 1;
    const maxQueryLength = 50;
    let limit = Number.parseInt(limitString);
    if (!Number.isInteger(limit)) limit = null;
    let requestedPage = Number.parseInt(pageString);
    if (!Number.isInteger(requestedPage)) requestedPage = null;
    let invoices = null;
    try {
        invoices = await Invoice.getAll();
        if (!Array.isArray(invoices)) throw new Error("Error while loading from db");
    } catch (err) {
        return sendError(res, 500, `Couldn't load invoices from db: ${err.message}`);
    }
    if (authorLoginString && req.user.role !== Service.roleAdmin) {
        return sendError(res, 403, `Forbidden`);
    } else if (authorLoginString) {
        const value = await filterArrayByAuthor(res, authorLoginString, invoices, (x, id) => id === x.registry.user.toString());
        if (value === false) return;
        else invoices = value;
    }
    if (req.user.role !== Service.roleAdmin) {
        invoices = invoices.filter(x => user.id.toString() === x.registry.user.toString());
    }
    if (searchQueryString && searchTypeString) {
        if (searchQueryString.length > maxQueryLength || searchQueryString.length < minQueryLength) {
            return sendError(res, 400, `Bad search request: search query too long or short`, {query: searchQueryString});
        }
        let searchCallback;
        switch (searchTypeString) {
            case "num": searchCallback = x => x.number === Number.parseInt(searchQueryString); break;
            case "description": searchCallback = x => x.description.toLowerCase().includes(searchQueryString.toLowerCase()); break;
            case "location": searchCallback = x => x.location.toLowerCase().includes(searchQueryString.toLowerCase()); break;
            default: return sendError(res, 400, `Bad search request: such type ${req.query.type} is not defined`, {type:req.query.type});
        }
        invoices = invoices.filter(searchCallback);
    }
    invoices.forEach(x => {
        delete x.id;
        x.links = [
            createLink("self", "GET", `${req.baseUrl}/invoices/${x.number}`),
            createLink("registry", "GET", `${req.baseUrl}/registries/${x.registry.number}`)
        ];
        if (req.user.role === Service.roleAdmin) {
            x.links.push(createLink("recipient", "GET", `${req.baseUrl}/users/${x.recipient.login}`));
        }
        x.recipient = x.recipient.login;
        x.registry = x.registry.number;
    });
    const responseObject = {};
    const links = [createLink("create invoice", "POST", `${req.baseUrl}/invoices/`)]; 
    pagination(req, limit, invoices, requestedPage, responseObject, links);
    if (authorLoginString) responseObject.author = authorLoginString;
    if (searchQueryString && searchTypeString) {
        responseObject.searchOptions = {
            query: searchQueryString,
            type: searchTypeString
        };
    }
    res.send(responseObject);         
});

router.get('/invoices/:number(\\d+)', authenticate, async (req, res) => {
    const user = req.user;
    const numberString = req.params.number;
    const number = Number.parseInt(numberString);
    let invoice = null;
    try {
        invoice = await Invoice.getByNumber(number);
    } catch (err) {
        return sendError(res, 500, `Couldn't load invoice #${numberString} from db: ${err.message}`);
    }
    if (!invoice || !invoice.registry || !invoice.recipient) {
        return sendError(res, 404, `Not found requested invoice in db`, {invoice: number});
    }
    const sender = invoice.registry.user;
    if (user.role === Service.roleStandart 
        && sender._id.toString() !== user.id.toString()
        && invoice.recipient._id.toString() !== user.id.toString()) {
        return sendError(res, 403, 'Forrbiden');
    }
    delete invoice.id;
    let links = [
        createLink("udpate self", "PUT", `${req.baseUrl}/invoices/${invoice.number}`),
        createLink("delete self", "DELETE", `${req.baseUrl}/invoices/${invoice.number}`)
    ];
    if (user.role === Service.roleStandart && invoice.recipient._id.toString() === user.id.toString()) {
        delete invoice.registry;
        links = [];
        links.push(createLink("recipient", "GET", `${req.baseUrl}/me`));
    } else if (user.role === Service.roleStandart && sender._id.toString() === user.id.toString()) {
        invoice.registry = invoice.registry.number;
        links.push(createLink("sender", "GET", `${req.baseUrl}/me`));
        links.push(createLink("registry", "GET", `${req.baseUrl}/registries/${invoice.registry}`));
    } else {
        invoice.registry = invoice.registry.number;
        links.push(createLink("sender", "GET", `${req.baseUrl}/users/${sender.login}`));
        links.push(createLink("registry", "GET", `${req.baseUrl}/registries/${invoice.registry}`));
        links.push(createLink("recipient", "GET", `${req.baseUrl}/users/${invoice.recipient.login}`));
    }
    invoice.sender = sender.login;
    invoice.recipient = invoice.recipient.login;
    res.send({
        data: invoice,
        links
    });
});

router.post('/invoices', authenticate, async (req, res) => {
    if (!req.body) return sendError(res, 400, `Bad request: No data was send in JSON format`);
    const registryNumStr = req.body.registryNum;
    const registryNum = Number.parseInt(registryNumStr);
    if (!Number.isInteger(registryNum)) return sendError(res, 400, 'Invalid registry data');
    const recipientLogin =  req.body.recipientLogin ? req.body.recipientLogin : null;
    if (req.user.role === Service.roleStandart) {         
        if (recipientLogin === req.user.login || !req.user.registries.some(x => x.number === registryNum)) {
            return sendError(res, 403, 'Forbidden: registry num is not allowed to use for this user');
        }
    }
    const description = req.body.description ? req.body.description.trim() : null;
    const departure = new Date(req.body.departure);
    const location = req.body.location ? req.body.location.trim() : null;
    const weight = Number.parseFloat(req.body.weight);
    const cost = Number.parseFloat(req.body.cost);
    const photoUrl = req.body.photoUrl ? req.body.photoUrl.trim() : null;
    const daysDelivery = 4;
    if (!(description && Object.prototype.toString.call(departure) === "[object Date]" 
        && !isNaN(departure.getTime()) && location && weight > 0 && cost > 0 && photoUrl)) {
            return sendError(res, 400, `Bad request - invalid post data`);
    }
    let arrival = new Date(departure);
    arrival.setDate(arrival.getDate() + daysDelivery);
    arrival = arrival.toISOString();
    const invoice = new Invoice(-1, -1, -1, description, 
       departure.toISOString(), arrival, location, weight, cost, photoUrl);
    let invoiceModel = null;
    try {
        const registry = await Registry.getByNumber(registryNum);
        const recipient = await User.getByLogin(recipientLogin);
        if (!recipient || !registry) return sendError(res, 404, 'Couldn\'t find recipient or registry', {registry: registryNumStr, recipient: recipientLogin});
        invoice.recipient = recipient.id;
        invoice.registry = registry.id;
        const id = await Invoice.insert(invoice);
        invoiceModel = await Invoice.getById(id);
        if (!invoiceModel) throw new Error('invoice wasn\'t added');
    } catch (err) {
        return sendError(res, 400, `Couldn't add invoice: ${err.message}`);
    }
    delete invoiceModel.id;
    invoiceModel.recipient = invoiceModel.recipient.login;
    invoiceModel.registry = invoiceModel.registry.number;
    res.status(201).send({
        data: invoiceModel,
        links: [createLink("self", "GET", `${req.baseUrl}/invoices/${invoiceModel.number}`)]
    });
});

router.put('/invoices/:number(\\d+)', authenticate, async(req, res) => {
    const user = req.user;
    const numberString = req.params.number;
    const number = Number.parseInt(numberString) || null;
    if (!req.body) return sendError(res, 400, `Bad request: no body recieved`);
    const registryNum = req.body.registryNum ? req.body.registryNum : null;
    const recipientLogin =  req.body.recipientLogin ? req.body.recipientLogin : null;
    const description = req.body.description ? req.body.description.trim() : null;
    let departure = new Date(req.body.departure);
    const location = req.body.location ? req.body.location.trim() : null;
    const weight = Number.parseFloat(req.body.weight) || null;
    const cost = Number.parseFloat(req.body.cost) || null;
    const photoUrl = req.body.photoUrl ? req.body.photoUrl.trim() : null;
    const daysDelivery = 4;
    if (!(Object.prototype.toString.call(departure) === "[object Date]" 
        && !isNaN(departure.getTime()))) {
        departure = null;
    }
    if (!(description || departure || location || weight > 0 || cost > 0 || photoUrl)) {
        return sendError(res, 400, `Bad request - no data to update`);
    }
    let arrival = departure ? new Date(departure) : null;
    if (arrival) {
        arrival.setDate(arrival.getDate() + daysDelivery);
        arrival = arrival.toISOString();
    }
    let invoiceObj, recipient, registry = null;
    try {
        invoiceObj = await Invoice.getByNumber(number);
        recipient = await User.getByLogin(recipientLogin);
        registry = await Registry.getByNumber(registryNum);
        if (!invoiceObj) return sendError(res, 404, "Couldn't find passsed id in db", {invoice: numberString});
        if ((recipientLogin && !recipient) || (registryNum && !registry)) {
           return sendError(res, 404, "Couldn't find recipient or registry in db", {recipient: recipientLogin, registry: registryNum});
        }
    } catch (err) {
        return sendError(res, 400, `Couldn't update invoice: ${err.message}`);
    }
    if (user.role === Service.roleStandart) {         
        if (((recipient && recipient.id.toString() === user.id.toString()) || (registry 
            && !user.registries.some(x => x.id.toString() === registry.id.toString())))
            || invoiceObj.registry.user.id.toString() !== user.id.toString()) {
            return sendError(res, 403, 'Forbidden');
        }
    }
    const recipentID = recipient ? recipient.id : null;
    const departureStr = departure ? departure.toISOString() : null;
    const registryID = registry ? registry.id : null;
    const invoice = new Invoice(invoiceObj.id, -1, recipentID || invoiceObj.recipient, 
        description || invoiceObj.description, departureStr || invoiceObj.departure,
        arrival || invoiceObj.arrival, location || invoiceObj.location, 
        weight || invoiceObj.weight, cost || invoiceObj.cost, photoUrl || invoiceObj.photoPath, 
        registryID || invoiceObj.registry);
    let newModel = null;
    try {
        await Invoice.update(invoice);
        newModel = await Invoice.getById(invoiceObj.id);
    } catch (err) {
        return sendError(res, 400, `Couldn't update invoice: ${err.message}`);
    }
    delete newModel.id;
    newModel.recipient = newModel.recipient.login;
    newModel.registry = newModel.registry.number;
    res.send({
        data: newModel,
        links: [createLink("self", "GET", `${req.baseUrl}/invoices/${newModel.number}`)]
    });
});

router.delete('/invoices/:number(\\d+)', authenticate, async(req, res) => {
    const user = req.user;
    const numberString = req.params.number;
    const number = Number.parseInt(numberString);
    try {
        const invoice = await Invoice.getByNumber(number);
        if (!invoice) return sendError(res, 404, 'Not found such invoice', {invoice: numberString});
        if (user.role === Service.roleStandart) {         
            if (invoice.registry.user.id.toString() !== user.id.toString()) {
                return sendError(res, 403, 'Forbidden');
            }
        }
        await Invoice.delete(invoice.id);
    } catch (e) {
        return sendError(res, 400, `Couldn't delete invoice: ${e.message}`);
    }
    res.status(204).end();
});

// Registries
router.get('/registries', authenticate, async (req, res) => {
    const user = req.user;
    const limitString = req.query.limit;
    const pageString = req.query.page;
    const searchQueryString = req.query.query ? req.query.query.trim() : null;
    const authorLoginString = req.query.author ? req.query.author.trim() : null;
    const maxQueryLength = 50;
    let limit = Number.parseInt(limitString);
    if (!Number.isInteger(limit)) limit = null;
    let requestedPage = Number.parseInt(pageString);
    if (!Number.isInteger(requestedPage)) requestedPage = null;
    let registries = null;
    try {
        registries = await Registry.getAll();
        if (!Array.isArray(registries)) throw new Error("Error while loading from db");
    } catch (err) {
        return sendError(res, 500, `Couldn't load registries from db: ${err.message}`);
    }
    if (authorLoginString && req.user.role !== Service.roleAdmin) {
        return sendError(res, 403, `Forbidden`);
    } else if (authorLoginString) {
        const value = await filterArrayByAuthor(res, authorLoginString, registries, (x, id) => id === x.user._id.toString());
        if (value === false) return;
        else registries = value;
    }
    if (req.user.role !== Service.roleAdmin) {
        registries = registries.filter(x => user.id.toString() === x.user._id.toString());
    }
    if (searchQueryString) {
        if (searchQueryString.length > maxQueryLength) {
            return sendError(res, 400, `Bad search request: search query too long or short`, {query: searchQueryString});
        }
        registries = registries.filter(x => {
            const decription = x.description.toLowerCase();
            const name = x.name.toLowerCase();
            return decription.includes(searchQueryString.toLowerCase()) || name.includes(searchQueryString.toLowerCase());
        });
    }
    registries.forEach(x => {
        x.user = { login: x.user.login, avaUrl: x.user.avaUrl, fullname: x.user.fullname };
        delete x.id;
        x.invoices = x.invoices.map(x => x.number);
        x.links = [
            createLink("self", "GET", `${req.baseUrl}/registries/${x.number}`),
            createLink("author", "GET", `${req.baseUrl}/users/${x.user}`)
        ];
    });
    const responseObject = {};
    const links = [createLink("create registry", "POST", `${req.baseUrl}/registries/`)]; 
    pagination(req, limit, registries, requestedPage, responseObject, links);
    if (authorLoginString) responseObject.author = authorLoginString;
    if (searchQueryString) {
        responseObject.searchOptions = {
            query: searchQueryString,
        };
    }
    res.send(responseObject);         
});

router.get('/registries/:number(\\d+)', authenticate, async (req, res) => {
    const user = req.user;
    const numberString = req.params.number;
    const number = Number.parseInt(numberString);
    let registry = null;
    try {
        registry = await Registry.getByNumber(number);
    } catch (err) {
        return sendError(res, 500, `Couldn't load registry #${numberString} from db: ${err.message}`);
    }
    if (registry) {
        if (user.role === Service.roleStandart 
            && registry.user._id.toString() !== user.id.toString()) {
            return sendError(res, 403, 'Forrbiden');
        }
        registry.invoices = registry.invoices.map(x => x.number);
        delete registry.id;
        let links = [
            createLink("udpate self", "PUT", `${req.baseUrl}/registries/${registry.number}`),
            createLink("delete self", "DELETE", `${req.baseUrl}/registries/${registry.number}`),
            createLink("author", "GET", `${req.baseUrl}/users/${registry.user.login}`)
        ];
        registry.user = { login: registry.user.login, avaUrl: registry.user.avaUrl, fullname: registry.user.fullname };
        res.send({
            data: registry,
            links
        });      
    } else {
        return sendError(res, 404, `Not found requested registry in db`, {number: numberString});
    }
});

router.post('/registries', authenticate, async (req, res) => {
    if (!req.body) return sendError(res, 400, `Bad request: No data was send in JSON format`);
    const userLogin = req.body.userLogin;
    const name = req.body.name ? req.body.name.trim() : null;
    const description = req.body.description ? req.body.description.trim() : null;
    if (!description || !name) {
        return sendError(res, 400, `Bad request - invalid post data`);
    }
    const registry = new Registry(-1, name, -1, description, Date.now());
    let registryModel = null;
    try {
        const user = await User.getByLogin(userLogin);
        if (!user) return sendError(res, 404, "No such user in db", {user: userLogin});
        if (req.user.role === Service.roleStandart) {         
            if (user.id.toString() !== req.user.id.toString()) {
                return sendError(res, 403, 'Forbidden');
            }
        }
        registry.user = user.id.toString();
        const id = await Registry.insert(registry);
        registryModel = await Registry.getById(id);
        if (!registryModel) throw new Error("Couldn't insert in db");
    } catch (err) {
        return sendError(res, 500, `Error while adding registry ${err.message}`);
    }
    delete registryModel.id;
    registryModel.user = registryModel.user.login;
    res.status(201).send({
        data: registryModel,
        links: [createLink("self", "GET", `${req.baseUrl}/registries/${registryModel.number}`)]
    });
});

router.put('/registries/:number(\\d+)', authenticate, async(req, res) => {
    if (!req.body) return sendError(res, 400, `Bad request: No data was send in JSON format`);
    const numberString = req.params.number;
    const number = Number.parseInt(numberString) || null;
    let registryObj = null;
    try {
        registryObj = await Registry.getByNumber(number);
        if (!registryObj) {
            return sendError(res, 404, 'Not found such registry', {registry: numberString});
        }
    } catch (e) {
        return sendError(res, 500, `Error while finding registry ${e.message}`);
    }
    const userLogin = req.body.userLogin || null;
    const name = req.body.name ? req.body.name.trim() : null;
    const description = req.body.description ? req.body.description.trim() : null;
    if (!description && !name && !userLogin) {
        return sendError(res, 400, `Bad request - invalid post data`);
    }
    if (req.user.role === Service.roleStandart && (userLogin !== null 
        || registryObj.user.id.toString() !== req.user.id.toString())) {         
        return sendError(res, 403, 'Forbidden');
    }
    const registry = new Registry(registryObj.id, name || registryObj.name, -1, 
        description || registryObj.description, null, registryObj.user.id);
    let registryModel = null;
    try {
        let user = null;
        if (userLogin) {
            user = await User.getByLogin(userLogin);
            if (!user) return sendError(res, 404, "No such user in db", {user: userLogin});
            registry.user = user.id.toString();
        }
        await Registry.update(registry);
        registryModel = await Registry.getByNumber(number);
        if (!registryModel) throw new Error("Couldn't insert in db");
    } catch (err) {
        return sendError(res, 500, `Error while adding registry ${err.message}`);
    }
    delete registryModel.id;
    registryModel.user = registryModel.user.login;
    registryModel.invoices = registryModel.invoices.map(x => x.number);
    res.send({
        data: registryModel,
        links: [createLink("self", "GET", `${req.baseUrl}/registries/${registryModel.number}`)]
    });
});

router.delete('/registries/:number(\\d+)', authenticate, async(req, res) => {
    const numberString = req.params.number;
    const number = Number.parseInt(numberString);
    try {
        const registry = await Registry.getByNumber(number);
        if (!registry) return sendError(res, 404, 'Not found such registry', {registry: numberString});
        if (req.user.role === Service.roleStandart) {         
            if (registry.user.id.toString() !== req.user.id.toString()) {
                return sendError(res, 403, 'Forbidden');
            }
        }
        await Registry.delete(registry.id);
    } catch (e) {
        return sendError(res, 400, `Couldn't delete invoice: ${e.message}`);
    }
    res.status(204).end();
});

// Users
router.get('/users', authenticate, async (req, res) => {
    if (req.user.role !== Service.roleAdmin) {
        return sendError(res, 403, `Forbidden`);
    }
    const limitString = req.query.limit;
    const pageString = req.query.page;
    let limit = Number.parseInt(limitString);
    if (!Number.isInteger(limit)) limit = null;
    let requestedPage = Number.parseInt(pageString);
    if (!Number.isInteger(requestedPage)) requestedPage = null;
    let users = null;
    try {
        users = await User.getAll();
        if (!Array.isArray(users)) throw new Error("Error while loading from db");
    } catch (err) {
        return sendError(res, 500, `Couldn't load users from db: ${err.message}`);
    }
    users.forEach(x => {
        delete x.id;
        delete x.password;
        x.registries = x.registries.map(y => y.number);
        x.upcomingInvoices = x.upcomingInvoices.map(y => y.number);
        x.links = [createLink("author", "GET", `${req.baseUrl}/users/${x.login}`)];
    });
    const responseObject = {};
    const links = [createLink("create user", "POST", `${req.baseUrl}/users`)]; 
    pagination(req, limit, users, requestedPage, responseObject, links);
    res.send(responseObject);         
});

router.head('/users/:login(\[A-Za-z_0-9]+)', async (req, res) => {
    const loginString = req.params.login;
    if (loginString  && !loginString.trim()) return res.status(400).end();
    let userObj = null;
    try {
        userObj = await User.getByLogin(loginString);
    } catch (err) {
        return res.status(500).end();
    }
    if (userObj) {
        return res.status(400).end();    
    } else {
        return res.status(200).end();
    }
});

router.get('/users/:login(\[A-Za-z_0-9]+)', authenticate, async (req, res) => {
    if (req.user.role !== Service.roleAdmin) {
        return sendError(res, 403, `Forbidden`);
    }
    const loginString = req.params.login;
    if (loginString  && !loginString.trim()) return sendError(res, 400, `Requested login is empty`, {login: loginString});
    let userObj = null;
    try {
        userObj = await User.getByLogin(loginString);
    } catch (err) {
        return sendError(res, 500, `Couldn't load user with login ${loginString} from db: ${err.message}`);
    }
    if (userObj) {
        const IDUser = userObj.id.toString();
        userObj = cleanSensetiveUserInfo(userObj);
        const responseObject = {
            data: userObj
        };
        if (req.user.id.toString() === IDUser) {
            responseObject.links = [
                createLink("udpate self", "PUT", `${req.baseUrl}/users/${userObj.login}`),
                createLink("delete self", "DELETE", `${req.baseUrl}/users/${userObj.login}`),
            ];
        }
        res.send(responseObject);      
    } else {
        return sendError(res, 404, `Not found user registry in db`, {login: loginString});
    }
});

router.post('/users', async (req, res) => {
    if (!req.body) return sendError(res, 400, `Bad request: No data was send in JSON format`);
    const loginRegExPattern = /[A-Za-z_0-9]{5,20}/;
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegExPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const phoneRegExPattern = /\+380[0-9]{9}/;
    const login = req.body.login;
    if (!login || !login.match(loginRegExPattern)) return sendError(res, 400, `Invalid login`, {login});
    const pasword = req.body.pasw;
    if (!pasword) return sendError(res, 400, 'Invalid password', {pasword});
    else if (pasword.length < 8 || pasword.length > 30) return sendError(res, 400, 'Invalid password length', {info: "from 8 to 30 length should be"});
    const fullname = req.body.fullname ? req.body.fullname.trim() : null;
    if (!fullname || fullname.length < 3 || fullname.length > 30) return sendError(res, 400, 'Invalid fullname', {fullname});
    const email = req.body.email ? req.body.email.toLowerCase().trim() : null;
    if (!email || !email.match(emailRegExPattern)) return sendError(res, 400, 'Invalid email', {email});
    const phone = req.body.phone ? req.body.phone.trim() : null;
    if (!phone || !phone.match(phoneRegExPattern)) return sendError(res, 400, 'Invalid phone', {phone});
    const avaUrl = req.body.avaUrl || null;
    const bio = req.body.bio || null;
    const user = new User(-1, login, Service.sha512(pasword, config.SaltHash), 
        Service.roleStandart, fullname, email, phone, Date.now());
    if (avaUrl) user.avaUrl = avaUrl;
    if (bio) user.bio = bio; 
    let userModel = null;
    try {
        const userSameLogin = User.getByLogin(login);
        if (await userSameLogin) {
            return sendError(res, 400, 'This login is not awailable. Select another one', {login});
        }
        const id = await User.insert(user);
        userModel = await User.getById(id);
        if (!userModel) throw new Error("Couldn't insert to db");
    } catch (e) {
        return sendError(res, 500, `Error accessing to db ${e.message}`);
    }
    userModel = cleanSensetiveUserInfo(userModel);
    res.status(201).send({
        data: userModel,
        links: [createLink("self", "GET", `${req.baseUrl}/me`)]
    });
});

router.put('/users/:login(\[A-Za-z_0-9]+)', authenticate, async(req, res) => {
    if (!req.body) return sendError(res, 400, `Bad request: No data was send in JSON format`);
    const loginString = req.params.login;
    if (loginString  && !loginString.trim()) return sendError(res, 400, `Requested login is empty`, {login: loginString});
    let userObj = null;
    try {
        userObj = await User.getByLogin(loginString);
    } catch (err) {
        return sendError(res, 500, `Couldn't load user with login ${loginString} from db: ${err.message}`);
    }
    if (!userObj) return sendError(res, 404, 'Not found such user', {login: loginString});
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailRegExPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const phoneRegExPattern = /\+380[0-9]{9}/;
    const fullname = req.body.fullname ? req.body.fullname.trim() : null;
    if (fullname && (fullname.length < 3 || fullname.length > 30)) return sendError(res, 400, 'Invalid fullname', {fullname});
    const email = req.body.email ? req.body.email.toLowerCase().trim() : null;
    if (email && !email.match(emailRegExPattern)) return sendError(res, 400, 'Invalid email', {email});
    const phone = req.body.phone ? req.body.phone.trim() : null;
    if (phone && !phone.match(phoneRegExPattern)) return sendError(res, 400, 'Invalid phone', {phone});
    const avaUrl = req.body.avaUrl || null;
    const bio = req.body.bio || null;
    const password = req.body.pasw;
    if (password && (password.length < 8 || password.length > 30)) return sendError(res, 400, 'Invalid password length', {info: "from 8 to 30 length should be"});
    let role = req.body.role || null;
    if (role && role < 0 && role > 3) return sendError(res, 400, 'Invalid role', {role});
    const photo = req.files ? req.files.photo : null;
    // https://regex101.com/codegen?language=javascript
    const fileRegExPattern = /(\.[a-zA-Z]+)/g;
    if ((photo && (photo.truncated || !photo.mimetype.startsWith(`image/`)))) {
        return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    }
    let photoExt = null;
    if (photo) {
        photoExt = photo.name.lastIndexOf('.') < 0 ? "" : photo.name.substr(photo.name.lastIndexOf('.'));
        if (!photoExt.match(fileRegExPattern)) return sendError(res, 400, `File extenrion is invalid`);
    }
    let user = null;
    if (req.user.role === Service.roleAdmin) {
        if (req.user.id.toString() !== userObj.id.toString()) {
            if (fullname || email || phone || avaUrl || bio || password || photo) {
                return sendError(res, 403, 'Forbidden');
            } else {
                user = new User(userObj.id.toString(), null, null, role, userObj.fullname,
                    userObj.email, userObj.phone, null, userObj.avaUrl, userObj.bio,
                    userObj.isDisabled);
            }
        } else {
            if (role !== null) {
                return sendError(res, 403, 'Forbidden');
            } 
        }
    } else {
        if (role || req.user.id.toString() !== userObj.id.toString()) {
            return sendError(res, 403, 'Forbidden');
        }
    }
    const hashedPasw = password ? Service.sha512(password, config.SaltHash) : null;
    if (req.user.id.toString() === userObj.id.toString() && hashedPasw !== userObj.password) {
        return sendError(res, 406, `Password doesn't match`);
    }
    if (!user) {
        user = new User(userObj.id.toString(), null, userObj.password, 
            userObj.role, fullname || userObj.fullname, email || userObj.email, phone || userObj.phone,
            null, avaUrl || userObj.avaUrl, bio || userObj.bio, userObj.isDisabled);
    }
    let userModel = null;
    try {
        await User.update(user);
        if (photo) {
            await user.deleteAvatarFromStorage();
            await user.loadAvatarToStorage(photo.data);
        }
        userModel = await User.getById(userObj.id.toString());
        if (!userModel) throw new Error("Error while updating");
    } catch (err) {
        return sendError(res, 400, `Couldn't update user: ${err.message}`);
    }
    userModel = cleanSensetiveUserInfo(userModel);
    res.send({data: userModel});
});

router.delete('/users/:login(\[A-Za-z_0-9]+)', authenticate, async(req, res) => {
    const loginString = req.params.login;
    if (loginString  && !loginString.trim()) return sendError(res, 400, `Requested login is empty`, {login: loginString});
    try {
        const userObj = await User.getByLogin(loginString);
        if (!userObj) return sendError(res, 404, 'Not found such user', {login: loginString});
        if (req.user.role === Service.roleAdmin) {
            if (req.user.id.toString() === userObj.id.toString()) {
                return sendError(res, 403, 'Forbidden');
            }
        } else {
            if (req.user.id.toString() !== userObj.id.toString()) {
                return sendError(res, 403, 'Forbidden');
            }
        }
        await User.delete(userObj.id.toString());
    } catch (err) {
        return sendError(res, 500, `Couldn't delete user with login ${loginString} from db: ${err.message}`);
    }
    res.status(204).end();
});

function sendError(res, code, error, errorData) {
    res.status(code).send({error, errorData});
}

function createLink(rel, method, href) {
    return {
        rel,
        method,
        href
    };
}

async function filterArrayByAuthor(res, authorLoginString, array, cb) {
    let id = null;
    try {
        const user = await User.getByLogin(authorLoginString);
        if (user) {
            id = user.id.toString();
        } else {
            sendError(res, 404, 'No such author', {login: authorLoginString});
            return false;
        }
    } catch (e) {
        sendError(res, 500, 'Couldn\'t fetch db');
        return false;
    }
    return array.filter(x => cb(x, id));
}

function pagination(req, limit, array, requestedPage, responseObject, links) {
    const elementsPerPage = limit && limit > 0 ? limit : 4;
    const totalCount = array.length;
    const totalPages = Math.ceil(totalCount / elementsPerPage);
    let currentPage = requestedPage > 0 && requestedPage <= totalPages ? requestedPage : 1;
    const firstInvoiceIndex = (currentPage - 1) * elementsPerPage;
    const lastInvoiceIndexExclusive = Math.min(currentPage * elementsPerPage, totalCount);
    if (totalPages === 0) currentPage = 0;
    responseObject.data = array.slice(firstInvoiceIndex, lastInvoiceIndexExclusive);
    responseObject.limit = elementsPerPage;
    responseObject.page = currentPage;
    responseObject.totalCount = totalCount;
    responseObject.totalPages = totalPages;
    const createLinkNavObject = (rel, method, page) => createLink(rel, method, `${url.parse(req.originalUrl).pathname}${url.format({query: {page}})}`);
    if (currentPage - 1 > 0) {
        links.push(createLinkNavObject('prev', 'GET', currentPage - 1));
    }
    if (currentPage !== totalPages) {
        links.push(createLinkNavObject('next', 'GET', currentPage + 1));
    }
    responseObject.links = links;
}

function cleanSensetiveUserInfo(user) {
    user.upcomingInvoices.forEach(x => {
        delete x.id;
        delete x.recipient;
    });
    user.registries.forEach(x => delete x.id);
    delete user.password; 
    delete user.id;
    return user;
}

module.exports = router;