export const USER_AUTHENTICATE_REQUEST = 'USER_AUTHENTICATE_REQUEST';
export const USER_AUTHENTICATE_SUCCESS = 'USER_AUTHENTICATE_SUCCESS';
export const USER_AUTHENTICATE_FAILURE = 'USER_AUTHENTICATE_FAILURE';

export function authenticate(login, password) {
    return async function(dispatch) {
        dispatch({ 
            type: USER_AUTHENTICATE_REQUEST,
            payload: { isFetching: true }
        });
        const credentials = `login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`;
        const bodyData = new URLSearchParams(credentials);
        let response, respBody;
        try {
            response = await fetch("/auth/login", { method: 'POST', body: bodyData });
            if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
            respBody = await response.json();
        } catch (e) {
            console.log(e);
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { error: e, statusCode: response.status }
            });
        }
        console.log(respBody);
        const jwt = respBody.token;
        const userObject = respBody.user;
        dispatch({
            type: USER_AUTHENTICATE_SUCCESS,
            payload: { jwt, userObject },
        });
    };
}

export function logout() {
    return {
        type: 'USER_LOGOUT',
        payload: {
            hmm: true
        },
    };
}