const Ui = {
    paginationNavEl: document.getElementById('invoicesPagination'),
    invoicesListEl: document.getElementById('invoices'),
    invoicesTextEl: document.getElementById('invoices-page-stats'),
    invoiceHeaderEl: document.getElementById('invoices-header'),
    searchFormEl: document.getElementById('search'),
    searchTypeEl: document.getElementById('type-search'),
    searchFieldEl: document.getElementById('search-field'),
    searchResetEl: document.getElementById('clear-search'),
    invoicesListTemplate: null,
    invoicesPaginationTemplate: null,
    invoicesTextTemplate: null,
    
    setInvoiceHeader(searchQuery, isAmin) {
        const header = document.getElementById('invoices-header');
        if (searchQuery) {
            header.innerText = "Результати пошуку";
        } else {
            if (isAmin) {
                header.innerText = "Список транспортних накладних";
            } else {
                header.innerText = "Список моїх транспортних накладних";
            }
        }
    },

    setPageTitle(searchQuery) {
        if (searchQuery) {
            document.title = `Результати пошуку накладних за '${searchQuery}'`;
        } else {
            document.title = "Транспортні накладні";
        }
    },

    get listOfPaginationLinks() {
        const navigation = document.getElementById('invoicesPagination');
        if (!navigation) return;
        return navigation.getElementsByClassName("page-link");
    },

    async loadTemplates() {
        try {
            const responsePagination = await fetch('/templates/invoices-pagination.mst');
            const responseListInvoices = await fetch('/templates/invoices-list.mst');
            const responseTextInvoices = await fetch('/templates/invoices-text.mst');
            this.invoicesPaginationTemplate = await responsePagination.text();
            this.invoicesListTemplate = await responseListInvoices.text();
            this.invoicesTextTemplate = await responseTextInvoices.text();
        } catch (e) {
            console.log(e);
        }
    },

    setFilter(filter) { this.filterInputEl.value = filter; },

    renderText(invoices, roleAdmin) {
        const template = this.invoicesTextTemplate;
        if (!template) return;
        let type;
        if (invoices.searchOptions) {
            switch (invoices.searchOptions.type) {
                case "description": type = "опису"; break;
                case "location":    type = "пототчному місцезнаходженню"; break;
                default:            type = "номеру квитанції"; break;
            }
        }
        const data = { 
            invoices: invoices.data,
            totalCount: invoices.totalCount,
            currentPage: invoices.page,
            totalPages: invoices.totalPages,
            searchType: invoices.searchOptions ? type : false,
            searchQuery: invoices.searchOptions ? invoices.searchOptions.query : false ,
            IsAdmin: roleAdmin
        };
        const renderedHTML = Mustache.render(template, data);
        if (!this.invoicesTextEl) return;
        this.invoicesTextEl.innerHTML = renderedHTML;
    },

    renderInvoices(invoices, roleAdmin) {
        const template = this.invoicesListTemplate;
        if (!template) return;
        const data = { 
            invoices: invoices.data,
            searchQuery: !!invoices.searchOptions,
            IsAdmin: roleAdmin
        };
        const renderedHTML = Mustache.render(template, data);
        if (!this.invoicesListEl) return;
        this.invoicesListEl.innerHTML = renderedHTML;
    },

    renderPagination(invoices) {
        if (this.listOfPaginationLinks) {
            for (const link of this.listOfPaginationLinks) {
                link.removeEventListener("click", OnPageLinkClicked);
            }
        }
        const template = this.invoicesPaginationTemplate;
        const currentPage = invoices.page;
        const totalPages = invoices.totalPages;
        const pages = new Array(totalPages);
        for (let i = 0; i < pages.length; i++) {
            pages[i] = { current: i + 1 === currentPage, number: i + 1};
        }
        const data = { 
            prevPage: currentPage - 1 > 0 ? currentPage - 1 : null,
            nextPage: currentPage !== totalPages ? currentPage + 1 : null,
            pages
        };
        const renderedHTML = Mustache.render(template, data);
        this.paginationNavEl.innerHTML = renderedHTML;
        this.bindPaginationLinks();
    },

    bindPaginationLinks() {
        if (this.listOfPaginationLinks) {
            for (const link of this.listOfPaginationLinks) {
                link.addEventListener("click", OnPageLinkClicked);
            }
        }
    },

    bindFormGroupEls() {
        if (!this.searchFormEl && !this.searchFieldEl && !this.searchResetEl && !this.searchTypeEl) {
            return;
        }
        this.searchFormEl.addEventListener('submit', async function (e) {
            e.preventDefault();
            data.searchType = Ui.searchTypeEl.value;
            data.searchQuery = Ui.searchFieldEl.value; 
        });
        this.searchFieldEl.addEventListener('input', function(e) {
            data.searchType = Ui.searchTypeEl.value;
            data.searchQuery = e.target.value; 
        });
        this.searchResetEl.addEventListener('click', function(e) {
            Ui.searchFieldEl.value = '';
            data.searchQuery = '';
        });
        this.searchTypeEl.addEventListener('change', function(e) {
            const type = e.target.value;
            let placeholder;
            switch (type) {
                case "description": placeholder = "Опис"; break;
                case "location":    placeholder = "Місцезнаходження"; break;
                default:            placeholder = "№ квитанції"; break;
            }
            Ui.searchFieldEl.setAttribute("placeholder", placeholder);
            if (Ui.searchFieldEl.value) {
                data.searchType = type;
                data.searchQuery = data.searchQuery; 
            }
        });
    }
};

async function OnPageLinkClicked(e) {
    console.log("clicked");
    const pageStr = e.target.getAttribute("data-page");
    if (!pageStr) { console.log("hmm no string", pageStr, e.target);return;};
    const page = parseInt(pageStr);
    if (!Number.isInteger(page))  { console.log("hmm no number", page); return;};
    console.log(page);
    data.currentPage = page;
}