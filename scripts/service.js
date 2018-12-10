const crypto = require('crypto');

module.exports = {  
    sendErrorPage: (res, code, title, message) => {
        title = `${code}: ${title}`;
        res.status(code).render('special/errorPage', { title: title, error: {
            title: title,
            message: message || null
        }, breadcrumbs: [{text: `error ${code}`}]});
    },

    toFormatedString: function () {
        const y = this.getFullYear();
        const m = `${(this.getMonth() + 1) > 9 ? '' : '0'}` + (this.getMonth() + 1); // getMonth() is zero-based
        const d = `${this.getDate() > 9 ? '' : '0'}` + this.getDate();
        const H = `${this.getHours() > 9 ? '' : '0'}` + this.getHours();
        const M = `${this.getMinutes() > 9 ? '' : '0'}` + this.getMinutes();
        const S = `${this.getSeconds() > 9 ? '' : '0'}` + this.getSeconds();
        return `${d}.${m}.${y} ${H}:${M}:${S}`;
    },

    toValueHtmlString: function () {
        const y = this.getFullYear();
        const m = `${(this.getMonth() + 1) > 9 ? '' : '0'}` + (this.getMonth() + 1); // getMonth() is zero-based
        const d = `${this.getDate() > 9 ? '' : '0'}` + this.getDate();
        return `${y}-${m}-${d}`;
    },

    sha512: (password, salt) => {
        const hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('hex');
    },

    checkAuth: (req, res, next) => {
        if (!req.user) return module.exports.sendErrorPage(res, 401, 'Not authorized', 'Увійдіть на сайт');
        next();
    }, 
    
    roleAdmin: 3,

    roleStandart: 0,
    
    checkAdmin: (req, res, next) => {
        if (!req.user) return module.exports.sendErrorPage(res, 401, 'Not authorized', 'Увійдіть на сайт');
        else if (req.user.role !== module.exports.roleAdmin) return module.exports.sendErrorPage(res, 403, 'Forbidden', 'У вас немає прав доступу');
        else next();
    }   
};