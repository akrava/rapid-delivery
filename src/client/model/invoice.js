// @ts-check
import url from 'url';
import Response from './response';
import { authorizationHeaders } from './../utils/service';

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

    static async getByNumber(jwt, number) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/invoices/${number}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(response.statusText);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async deleteByNumber(jwt, number){
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'DELETE';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/invoices/${number}`, reqOptions);
            statusCode = response.status;
            if (statusCode !== 204) throw new Error(response.statusText);
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async create(jwt, formData) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = "POST";
        reqOptions.body = formData;
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch("/api/v1/invoices", reqOptions);
            statusCode = response.status;
            if (!response.ok || response.status !== 201) throw new Error(`Сталася помилка під час створення`);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async update(jwt, number, formData) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = "PUT";
        reqOptions.body = formData;
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/invoices/${encodeURIComponent(number)}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(`Сталася помилка під час оновлення`);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }
}

export default Invoice;