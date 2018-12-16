// @ts-check
import Response from './response';
import { authorizationHeaders, formDataToJson } from './../utils/service';

class Notify {
    static async sendNotification(jwt, formData) {
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'POST';
        reqOptions.headers['Content-Type'] = 'application/json';
        reqOptions.body = formDataToJson(formData);
        let response, respBody, statusCode;
        let error = null;
        try {
            response = await fetch(`/api/v1/users/notify`, reqOptions);
            statusCode = response.status;
            if (!response.ok) throw new Error(response.statusText);
        } catch (e) {
            error = e;
        }
        return new Response(statusCode, respBody, error);
    }
}

export default Notify;