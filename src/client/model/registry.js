// @ts-check
import url from 'url';
import Response from './response';
import { authorizationHeaders, /* formDataToJson */ } from './../utils/service';

class Registry {
    static async getAll(jwt, page, query, limit) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/registries${url.format({query: {page, query, limit}})}`, reqOptions);
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
            response = await fetch(`/api/v1/registries/${number}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(response.statusText);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async deleteByNumber(jwt, number) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'DELETE';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/registries/${number}`, reqOptions);
            statusCode = response.status;
            if (statusCode !== 204) throw new Error(response.statusText);
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }
}

export default Registry;