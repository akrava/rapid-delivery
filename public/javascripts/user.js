const User = {
    async me() {
        try {
            const response = await fetch('/api/v1/me', { credentials: 'same-origin' });
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