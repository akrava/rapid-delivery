const Invoice = {
    async getAll(page, filerType, filterQuery) {
        let query = '?';
        if (page) {
            query += 'page=' + encodeURIComponent(page.toString());
        }
        if (page && filerType && filterQuery) {
            query += '&';
        }
        if (filerType && filterQuery) {
            query += 'type=' + encodeURIComponent(filerType) + '&query=' + encodeURIComponent(filterQuery);
        }
        if (!(page || (filerType && filterQuery))) {
            query = '';
        }
        try {
            const response = await fetch('/api/v1/invoices' + query, { credentials: 'same-origin' });
            if (!response.ok) {
                throw new Error('Network response was not ok. ' + response.statusText);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
               return response.json();
            }
            throw new TypeError("Response witout JSON!");
        } catch (err) {
            console.log(err);
        }
    }
};