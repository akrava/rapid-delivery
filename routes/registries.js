const express = require('express'),
    url = require('url'),
    Registry = require('../models/registry'),
    User = require('../models/user'),
    Service = require('../scripts/service');

const router = express.Router();

router.get('/', Service.checkAuth, async (req, res) => {
    const user = req.user;
    const registriesPerPage = 4;
    const queryPage = "page";
    const reqPage = Number.parseInt(req.query[queryPage]);
    const minQueryLength = 3;
    const maxQueryLength = 50;
    let searchQuery = req.query.q ? req.query.q.trim() : null;
    let registries = null;
    try {
        registries = await Registry.getAll();
        if (!Array.isArray(registries)) throw new Error("Error while loading from db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Couldn't load registries from db`, err.message);
    }
    if (req.user.role === Service.roleStandart) {
        registries = registries.filter(x => user.id.toString() === x.user._id.toString());
    }
    if (searchQuery) {
        if (searchQuery.length > maxQueryLength || searchQuery.length < minQueryLength) {
            return Service.sendErrorPage(res, 400, `Bad search request`, `search query too long or short`);
        }
        registries = registries.filter(x => {
            const decription = x.description.toLowerCase();
            const name = x.name.toLowerCase();
            return decription.includes(searchQuery.toLowerCase()) || name.includes(searchQuery.toLowerCase());
        });
    } else {
        searchQuery = null;
    }
    const totalCount = registries.length;
    const totalPages = Math.ceil(totalCount / registriesPerPage);
    let currentPage = Number.isInteger(reqPage) && reqPage > 0 && reqPage <= totalPages ? reqPage : 1;
    const firstInvoiceIndex = (currentPage - 1) * registriesPerPage;
    const lastInvoiceIndexExclusive = Math.min(currentPage * registriesPerPage, totalCount);
    if (totalPages === 0) currentPage = 0;
    const pages = [];
    const currentQueryObj = req.query;
    for (let i = 1; i <= totalPages; i++) {
        currentQueryObj[queryPage] = i;
        pages.push({number: i, href: url.format({query: currentQueryObj}), current: i === currentPage});
    }
    res.render('registries', {
        title: searchQuery ? `Результати пошуку реєстрів за '${searchQuery}'` : "Реєстри",
        registriesPage: true,
        registries: registries.slice(firstInvoiceIndex, lastInvoiceIndexExclusive),
        currentPage,
        totalCount,
        currentCount: lastInvoiceIndexExclusive - firstInvoiceIndex,
        pages,
        prevPage: currentPage - 1 > 0 ? pages[currentPage - 2].href : null,
        nextPage: currentPage !== totalPages ? pages[currentPage].href : null,
        searchQuery
    });
});

router.get('/:number(\\d+)', Service.checkAuth, async (req, res) => {
    const user = req.user;
    const numberString = req.params.number;
    const num = Number.parseInt(numberString);
    if (!Number.isInteger(num)) return Service.sendErrorPage(res, 400, `Requested num is not a number`);
    let registry = null;
    try {
        registry = await Registry.getByNumber(num);
    } catch (err) {
        return Service.sendErrorPage(res, 400, `Couldn't load registry from db`, err.message);
    }
    if (registry) {
        if (user.role === Service.roleStandart 
            && registry.user._id.toString() !== user.id.toString()) {
            return Service.sendErrorPage(res, 403, 'Forrbiden');
        }
        registry.created = new Date(registry.created).toFormatedString();
        res.render('registry', {
            title: `Реєстр ${registry.number} - ${registry.name}`,
            registry
        });         
    } else {
        return Service.sendErrorPage(res, 404, `Not found requested registry in db`, 
            `Such registry with num ${num} not found`);
    }
});

router.get('/new', Service.checkAuth, async (req, res) => {
    const userLogined = req.user;
    let users = null;
    try {
        users = await User.getAll();
        if (!Array.isArray(users)) throw new Error("Error while loading users");
    } catch(err) {
        return Service.sendErrorPage(res, 500, `Couldn't additional load users from db`, err.message);
    }
    res.render('newRegistry', {
        title: "Створення реєстру",
        users,
        standartUser: userLogined.role === Service.roleStandart
    });
});

router.post('/add', Service.checkAuth, async (req, res) => {
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const userID = req.body.userID;
    const name = req.body.name ? req.body.name.trim() : null;
    const description = req.body.description ? req.body.description.trim() : null;
    if (!description || !name) {
        return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    }
    const registry = new Registry(-1, name, -1, description, Date.now(), userID);
    let registryModel = null;
    try {
        const user = await  User.getById(userID);
        if (!user) throw new Error("Error wfile loading user from db");
        if (req.user.role === Service.roleStandart) {         
            if (userID !== req.user.id.toString()) {
                return Service.sendErrorPage(res, 403, 'Forbidden');
            }
        }
        const id = await Registry.insert(registry);
        registryModel = await Registry.getById(id);
        if (!registryModel) throw new Error("Couldn't insert in db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Error while adding registry`, err.message);
    }
    res.redirect(`/registries/${registryModel.number}`);
});

router.post('/edit', Service.checkAuth, checkRightsForRegistry, async (req, res) => {
    const user = req.user;
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const registryIDString = req.body.id;
    const registryID = registryIDString ? registryIDString.trim() : null;
    let registry, users = null;
    try {
        registry = await Registry.getById(registryID);
        users = await User.getAll();
        if (!registry || !Array.isArray(users)) throw new Error("Couldn't load from db");
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Error while editing registry`, err.message);
    }
    users.forEach(x => {
        if (String(x.id) === String(registry.user.id)) {
            x.selected = true;
        }
    });
    res.render('newRegistry', {
        title: `Редагування реєстру ${registry.number} - ${registry.name}`,
        registry,
        users,
        standartUser: user.role === Service.roleStandart
    });
});

router.post('/update', Service.checkAuth, checkRightsForRegistry, async (req, res) => {
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const registryID = req.body.id;
    const userID = req.body.userID;
    const name = req.body.name ? req.body.name.trim() : null;
    const description = req.body.description ? req.body.description.trim() : null;
    if (!description || !name) {
        return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    }
    const registry = new Registry(registryID, name, -1, description, null, userID);
    let registryModel = null;
    try {
        registryModel = await Registry.getById(registryID);
        const user = await User.getById(userID);
        if (!registryModel || !user) throw new Error("Couldn't load from db");
        if (req.user.role === Service.roleStandart) {         
            if (userID !== req.user.id.toString()) {
                return Service.sendErrorPage(res, 403, 'Forbidden');
            }
        }
        await Registry.update(registry);
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Error while updating registry`, err.message);
    }
    res.redirect(`/registries/${registryModel.number}`);
});

router.post('/remove', Service.checkAuth, checkRightsForRegistry, async (req, res) => {
    if (!req.body) return Service.sendErrorPage(res, 400, `Bad request`);
    const registryID = req.body.id;
    if (!registryID) return Service.sendErrorPage(res, 400, `Bad request - invalid post data`);
    let registry = null;
    try {
        registry = await Registry.getById(registryID);
        if (!registry) throw new Error("Couldn't load registry from db");
        await Registry.delete(registryID);
    } catch (err) {
        return Service.sendErrorPage(res, 500, `Error while removing registry`, err.stack);
    }
    let invoices = registry.invoices.reduce((prev, cur) => {
        let text = prev;
        if (!text) text = "";
        else text += `, `;
        text += `${cur.number}`;
        return text;
    }, '');
    if (registry.invoices.length <= 0) {
        invoices = '';
    } else {
        invoices = 'Було видалено наступні накладні: ' + invoices + '. ';
    }
    return res.render('special/infoPage', {title: "Реєстр та накладні були видалені", info: {
        title: `Реєстр ${registry.number} - ${registry.name} та ${registry.invoices.length} накладних були успішно видалені`,
        message: `${invoices}Тепер можете повернутись до списку реєстрів`
    }});
});

async function checkRightsForRegistry(req, res, next) {
    if (req.user.role !== Service.roleStandart) return next();
    if (req.body && req.body.id) {
        const registryID = req.body.id;
        const registry = await Registry.getById(registryID);
        if (registry) {
            if (registry.user._id.toString() === req.user.id.toString()) {
                return next();
            } else {
                return Service.sendErrorPage(res, 403, 'Forbidden');
            }
        }
    }
    Service.sendErrorPage(res, 500, 'Server Error', `Couldn't get invoice`);
}

module.exports = router;