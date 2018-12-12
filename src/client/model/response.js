class Response {
    constructor(statusCode, respBody, error) {
        this.statusCode = statusCode;
        this.respBody = respBody;
        this.error = error;
    }
}

export default Response;