// @ts-check
import url from 'url';
import Response from './response';
import { authorizationHeaders, formDataToJson } from './../utils/service';

class User {
    static async authenticate(username, password) {
        const credentials = `login=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        const bodyData = new URLSearchParams(credentials);
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch("/auth/login", { method: 'POST', body: bodyData });
            statusCode = response.status;
            if (!response.ok) throw new Error(`Неправильний логін або пароль`);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async me(jwt) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch("/api/v1/me", reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(`Сталася помилка під час авторизації`);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async create(formData) {
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch("/api/v1/users", { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: formDataToJson(formData)
            });
            statusCode = response.status;
            if (!response.ok || response.status !== 201) throw new Error(`Сталася помилка під час реєстрації`);
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async isFreeLogin(login) {
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/users/${encodeURIComponent(login)}`, { method: "HEAD" });
            statusCode = response.status;
            if (!response.ok || response.status !== 200) throw new Error(`Логін вже існує`);
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async getByLogin(jwt, login) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/users/${encodeURIComponent(login)}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(`Сталася помилка під час авторизації`);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async updateByLogin(jwt, login, data, onlyRole = false) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'PUT';
        if (onlyRole !== false) {
            reqOptions.headers['Content-Type'] = 'application/json';
            reqOptions.body = JSON.stringify({ role: data });
        } else {
            reqOptions.body = data;
        }
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/users/${encodeURIComponent(login)}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(response.statusText);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }

    static async getAll(jwt, page, limit) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/users${url.format({query: {page, limit}})}`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(response.statusText);
            respBody = await response.json();
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }
}

export default User;