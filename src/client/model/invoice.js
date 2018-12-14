// @ts-check
import url from 'url';
import Response from './response';
import { authorizationHeaders, /* formDataToJson */ } from './../utils/service';

class Invoice {
    static async getAll(jwt, page, query, type, limit) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/invoices${url.format({query: {page, query, type, limit}})}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(response.statusText);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }
}

export default Invoice;