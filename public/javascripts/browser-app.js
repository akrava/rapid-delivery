const data = {
    invoicesOnPage: [],
    userRoleAdmin: false,
    searchType: "",
    _filterQuery: "",
    _currentPage: 1,

    get currentPage() {
        return this._currentPage;
    },
    
    set currentPage(page) {
        this._currentPage = page;
        this.loadInvoicesOnPage().then(function() {
            Ui.renderInvoices(data.invoicesOnPage, data.userRoleAdmin);
            Ui.renderPagination(data.invoicesOnPage);
            Ui.renderText(data.invoicesOnPage, data.userRoleAdmin);
            this._currentPage = data.invoicesOnPage.page;
        }).catch(function(err) {
            console.log(err);
        });
    },

    get searchQuery() {
        return this._filterQuery;
    },
    
    set searchQuery(value) {
        this._filterQuery = value;
        data._currentPage = 1;
        this.loadInvoicesOnPage().then(function() {
            Ui.renderInvoices(data.invoicesOnPage, data.userRoleAdmin);
            Ui.renderPagination(data.invoicesOnPage);
            Ui.renderText(data.invoicesOnPage, data.userRoleAdmin);
            Ui.setInvoiceHeader(value, data.userRoleAdmin);
            Ui.setPageTitle(value);
            this._currentPage = data.invoicesOnPage.page;
        }).catch(function(err) {
            console.log(err);
        });
    },

    loadInvoicesOnPage() {
        return Invoice.getAll(this.currentPage, this.searchType, this.searchQuery)
            .then(function (invoices) {
                data.invoicesOnPage = invoices;
            }).catch(function (error) {
                console.log(error);
            });
    },

};

window.addEventListener('load', async function(e) {
    await Ui.loadTemplates();
    Ui.bindPaginationLinks();
    const user = await User.me();
    if (user) {
        data.userRoleAdmin = user.role;
    }
    Ui.bindFormGroupEls();  
});