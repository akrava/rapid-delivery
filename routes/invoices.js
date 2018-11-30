const express = require('express'),
    url = require('url'),
    User = require('../models/user'),
    Invoice = require('../models/invoice'),
    Registry = require('../models/registry'),
    Service = require('../scripts/service');

const router = express.Router();

router.get('/', Service.checkAuth, async (req, res) => {
    const user = req.user;
    const invoicesPerPage = 4;
    const queryPage = "page";
    const minQueryLength = 3;
    const maxQueryLength = 50;
    const reqPage = Number.parseInt(req.query[queryPage]);
    let searchQuery = req.query.q ? req.query.q.trim() : null;
    let searchType = req.query.t;
    let invoices = null;
    try {
        invoices = await Invoice.getAll();
        if (!Array.isArray(invoices)) throw new Error("Error while loading from db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Couldn't load invoices from db`, err.message);
    }
    if (req.user.role === Service.roleStandart) {
        invoices = invoices.filter(x => user.id.toString() === x.registry.user.toString());
    }
    if (searchQuery && searchType) {
        if (searchQuery.length > maxQueryLength || searchQuery.length < minQueryLength) {
            return Service.sendErrorPage(res, 400, `Bad search request`, `search query too long or short`);
        }
        let searchCallback;
        switch (searchType) {
            case "num": {
                searchCallback = x => x.number === Number.parseInt(searchQuery);
                searchType = {name:"номеру", num: true};
            } break;
            case "description": {
                searchCallback = x => new String(x.description.toLowerCase()).includes(searchQuery.toLowerCase());
                searchType = {name:"опису", desc: true};
            } break;
            case "location": {
                searchCallback = x => new String(x.location).toLowerCase().includes(searchQuery.toLowerCase());
                searchType = {name: "поточному місцезнаходженню", loc: true};
            } break;
            default: return Service.sendErrorPage(res, 400, `Bad search request`, `such type ${req.query.type} is not defined`);
        }
        invoices = invoices.filter(searchCallback);
    } else {
        searchQuery = null;
    }
    const totalCount = invoices.length;
    const totalPages = Math.ceil(totalCount / invoicesPerPage);
    let currentPage = Number.isInteger(reqPage) && reqPage > 0 && reqPage <= totalPages ? reqPage : 1;
    const firstInvoiceIndex = (currentPage - 1) * invoicesPerPage;
    const lastInvoiceIndexExclusive = Math.min(currentPage * invoicesPerPage, totalCount);
    if (totalPages === 0) currentPage = 0;
    const pages = [];
    const currentQueryObj = req.query;
    for (let i = 1; i <= totalPages; i++) {
        currentQueryObj[queryPage] = i;
        pages.push({number: i, href: url.format({query: currentQueryObj}), current: i === currentPage});
    }
    res.render('invoices', {
        title: searchQuery ? `Результати пошуку накладних за '${searchQuery}'` : "Транспортні накладні",
        invoicesPage: true,
        invoices: invoices.slice(firstInvoiceIndex, lastInvoiceIndexExclusive),
        currentPage,
        totalCount,
        currentCount: lastInvoiceIndexExclusive - firstInvoiceIndex,
        pages,
        prevPage: currentPage - 1 > 0 ? pages[currentPage - 2].href : null,
        nextPage: currentPage !== totalPages ? pages[currentPage].href : null,
        searchQuery,
        searchType
    });            
});

router.get('/:number(\\d+)', Service.checkAuth, async (req, res) => {
    const user = req.user;
    const numberString = req.params.number;
    let invoice = null;
    try {
        invoice = await Invoice.getByNumber(numberString);
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Couldn't load invoice #${numberString} from db`, err.message);
    }
    if (!invoice || !invoice.registry || !invoice.recipient) {
        return Service.sendErrorPage(res, 404, `Not found requested invoice in db`, 
            `Such invoice with number ${numberString} not found`);
    }
    invoice.departure = new Date(invoice.departure).toFormatedString();
    invoice.arrival = new Date(invoice.arrival).toFormatedString();
    invoice.sender = invoice.registry.user;
    if (user.role === Service.roleStandart 
        && invoice.sender._id.toString() !== user.id.toString()
        && invoice.recipient._id.toString() !== user.id.toString()) {
        return Service.sendErrorPage(res, 403, 'Forrbiden');
    }
    res.render('invoice', {
        title: `ТТН №${invoice.number}`,
        invoice,
        isRecipientRoleStandart: invoice.recipient._id.toString() === user.id.toString() && user.role === Service.roleStandart
    });
});

router.get('/new', Service.checkAuth, async (req, res) => {
    const user = req.user;
    let users = null;
    try {
        users = await User.getAll();
        if (!Array.isArray(users)) throw new Error("Error while loading from db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Couldn't additional load users from db`, err.message);
    }
    const usersToCount = user.role === Service.roleStandart ? [user] : users;
    const count = usersToCount.reduce((value, curUser) => value += curUser.registries.length, 0);
    if (count === 0) {
        return res.render('special/infoPage', {title: "Створення ТТН", info: {
            title: `Накладна не може бути створена`,
            message: "Створіть реєстр, щоби мати можливість створювати ТТН"
        }});
    }
    res.render('newInvoice', {
        title: "Створення накладної",
        users: user.role === Service.roleStandart ? users.filter(x => user.id.toString() !== x.id.toString()) : users,
        standartUser: user.role === Service.roleStandart
    });
});

router.post('/edit', Service.checkAuth, checkRightsForInvoice, async (req, res) => {
    const user = req.user;
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const invoiceID = req.body.id;
    if (!invoiceID) return Service.sendErrorPage(res, 400, `Invalid post data: id`);
    let invoice, users = null;
    try {
        invoice = await Invoice.getById(invoiceID);
        users = await User.getAll();
        if (!invoice || !Array.isArray(users)) throw new Error("Error while loading from db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Couldn't edit invoice`, err.message);
    }
    users.forEach(curUser => {
        curUser.registries.forEach(curRegistry => {
            if (curRegistry.id.toString() === invoice.registry.id.toString()) {
                curRegistry.selectedRegistry = true;
            }
        });
        if (curUser.id.toString() === invoice.recipient.id.toString()) {
            curUser.selected = true;
        }
    });
    if (res.locals.loginedUser) {
        for (const registry of res.locals.loginedUser.registries) {
            if (registry.id.toString() === invoice.registry.id.toString()) {
                registry.selectedRegistry = true;
                break;
            }
        }
    }
    invoice.departure = new Date(invoice.departure).toValueHtmlString();
    res.render('newInvoice', {
        title: `Редагування накладної ${invoice.number}`,
        users: user.role === Service.roleStandart ? users.filter(x => user.id.toString() !== x.id.toString()) : users,
        invoice,
        standartUser: user.role === Service.roleStandart
    });
});

router.post('/update', Service.checkAuth, checkRightsForInvoice, async (req, res) => {
    if (!req.body) {
        return Service.sendErrorPage(res, 400, `Bad request`);
    }
    const invoiceID = req.body.id;
    const registryId = req.body.registryID ? req.body.registryID : null;
    const recipientId =  req.body.recipientID ? req.body.recipientID : null;
    const description = req.body.description ? req.body.description.trim() : null;
    const departure = new Date(req.body.departure);
    const location = req.body.location ? req.body.location.trim() : null;
    const weight = Number.parseFloat(req.body.weight);
    const cost = Number.parseFloat(req.body.cost);
    const photo = req.files ? req.files.photo : null;
    const daysDelivery = 4;
    // https://regex101.com/codegen?language=javascript
    const fileRegExPattern = /(\.[a-zA-Z]+)/g;
    if (!(description && Object.prototype.toString.call(departure) === "[object Date]" 
        && !isNaN(departure.getTime()) && location && weight > 0 && cost > 0 
        && ((photo && !photo.truncated && photo.mimetype.startsWith(`image/`)) || !photo))) {
            return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    }
    let photoExt = null;
    if (photo) {
        photoExt = photo.name.lastIndexOf('.') < 0 ? "" : photo.name.substr(photo.name.lastIndexOf('.'));
        if (!photoExt.match(fileRegExPattern)) return Service.sendErrorPage(res, 400, `File extenrion is invalid`);
    }
    let arrival = new Date(departure);
    arrival.setDate(arrival.getDate() + daysDelivery);
    arrival = arrival.toISOString();
    const invoice = new Invoice(invoiceID, -1, recipientId, description, 
       departure.toISOString(), arrival, location, weight, cost, null, registryId);
    let invoiceObj = null;
    try {
        invoiceObj = await Invoice.getById(invoiceID);
        const recipient = User.getById(recipientId);
        const registry = Registry.getById(registryId);
        if (!await recipient || !await registry || !invoiceObj) throw new Error("Couldn't find passsed id in db");
        await Invoice.update(invoice);
        if (photo) {
            await invoiceObj.deleteFileFromStorage();
            await invoiceObj.loadFileToStorage(photo.data);
        } 
    } catch (err) {
        return Service.sendErrorPage(res, 400, `Couldn't update invoice`, err.message);
    }
    res.redirect(`/invoices/${invoiceObj.number}`); 
});

router.post('/add', Service.checkAuth, async (req, res) => {
    if (!req.body || !req.files) {
        return Service.sendErrorPage(res, 400, `Bad request`);
    }
    const registryId = req.body.registryID ? req.body.registryID : null;
    const recipientId =  req.body.recipientID ? req.body.recipientID : null;
    if (req.user.role === Service.roleStandart) {         
        if (recipientId === req.user.id.toString() || !req.user.registries.some(x => x.id.toString() === registryId)) {
            return Service.sendErrorPage(res, 403, 'Forbidden');
        }
    }
    const description = req.body.description ? req.body.description.trim() : null;
    const departure = new Date(req.body.departure);
    const location = req.body.location ? req.body.location.trim() : null;
    const weight = Number.parseFloat(req.body.weight);
    const cost = Number.parseFloat(req.body.cost);
    const photo = req.files.photo;
    const daysDelivery = 4;
    // https://regex101.com/codegen?language=javascript
    const fileRegExPattern = /(\.[a-zA-Z]+)/g;
    if (!(description && Object.prototype.toString.call(departure) === "[object Date]" 
        && !isNaN(departure.getTime()) && location && weight > 0 && cost > 0 
        && photo && !photo.truncated && photo.mimetype.startsWith(`image/`))) {
            return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    }
    const photoExt = photo.name.lastIndexOf('.') < 0 ? "" : photo.name.substr(photo.name.lastIndexOf('.'));
    if (!photoExt.match(fileRegExPattern)) return Service.sendErrorPage(res, 400, `File extenrion is invalid`);
    let arrival = new Date(departure);
    arrival.setDate(arrival.getDate() + daysDelivery);
    arrival = arrival.toISOString();
    const invoice = new Invoice(-1, -1, recipientId, description, 
       departure.toISOString(), arrival, location, weight, cost, null, registryId);
    let invoiceModel = null;
    try {
        const recipient = User.getById(recipientId);
        const registry = Registry.getById(registryId);
        if (!await recipient || !await registry) throw new Error("Couldn't find passsed id in db");
        const id = await Invoice.insert(invoice);
        invoice.id = id;
        invoiceModel = await Invoice.getById(id);
        if (!invoiceModel) throw new Error("Couldn't insert in db");
        await invoice.loadFileToStorage(photo.data);
    } catch (err) {
        return Service.sendErrorPage(res, 400, `Couldn't add invoice`, err.message);
    }
    res.redirect(`/invoices/${invoiceModel.number}`);  
});

router.post('/remove', Service.checkAuth, checkRightsForInvoice, async (req, res) => {
    if (!req.body) {
        return Service.sendErrorPage(res, 400, `Bad request`);
    }
    const id = req.body.id;
    let invoice = null;
    try {
        invoice = await Invoice.getById(id);
        if (!invoice) throw new Error(`No such invoice in db ${id}`);
        await Invoice.delete(id);
    } catch (e) {
        return Service.sendErrorPage(res, 400, `Couldn't delete invoice`, e.message);
    }
    return res.render('special/infoPage', {title: "ТТН була видалена", info: {
        title: `Накладна #${invoice.number} була успішно видалена`,
        message: "Тепер можете повернутись до реєстру накладних"
    }});
});

async function checkRightsForInvoice(req, res, next) {
    if (req.user.role !== Service.roleStandart) return next();
    if (req.body && req.body.id) {
        const invoiceID = req.body.id;
        const invoice = await Invoice.getById(invoiceID);
        if (invoice) {
            if (invoice.registry.user._id.toString() === req.user.id.toString()) {
                return next();
            } else {
                return Service.sendErrorPage(res, 403, 'Forbidden');
            }
        }
    }
    Service.sendErrorPage(res, 500, 'Server Error', `Couldn't get invoice`);
}

module.exports = router;