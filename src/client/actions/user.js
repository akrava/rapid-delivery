export const USER_AUTHENTICATE_REQUEST = 'USER_AUTHENTICATE_REQUEST';
export const USER_AUTHENTICATE_SUCCESS = 'USER_AUTHENTICATE_SUCCESS';
export const USER_AUTHENTICATE_FAILURE = 'USER_AUTHENTICATE_FAILURE';
export const USER_LOGOUT               = 'USER_LOGOUT';
import { authorizationHeaders } from './../utils/service';
import { CURRENT_PATH_REDIRECT } from './redirect';

export const defaultPayload = {
    isFetching: false,
    isLogined: false,
    userObject: null,
    error: { 
        message: false, 
        statusCode: false
    },
    success: {
        message: false
    }
};

export function authenticate(login, password) {
    return async function(dispatch) {
        dispatch({ 
            type: USER_AUTHENTICATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const credentials = `login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`;
        const bodyData = new URLSearchParams(credentials);
        let response, respBody;
        try {
            response = await fetch("/auth/login", { method: 'POST', body: bodyData });
            if (!response.ok) throw new Error(`Неправильний логін або пароль`);
            respBody = await response.json();
        } catch (e) {
            console.log(e);
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { ...defaultPayload, error: { message: e.message, statusCode: response.status } }
            });
        }
        console.log(respBody);
        const jwt = respBody.token;
        localStorage.setItem("jwt", jwt); 
        const userObject = respBody.user;
        dispatch({
            type: USER_AUTHENTICATE_SUCCESS,
            payload: { ...defaultPayload, userObject, isLogined: true },
        });
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: '/'
            }
        });
    };
}

export function logout() {
    return function(dispatch) {
        localStorage.removeItem("jwt");
        dispatch({
            type: USER_LOGOUT,
            payload: {
                ...defaultPayload
            },
        });
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: '/'
            }
        });
    };
}

export function getUserFromJWT() {
    const jwt = localStorage.getItem('jwt');
    if (jwt === null) {
        return {
            type: 'JWT_NOT_FOUND',
            payload: {}
        };
    }
    console.log("OPA opa ");
    return async function(dispatch) { 
        dispatch({ 
            type: 'JWT_FOUND',
            payload: {}
        });
        dispatch({ 
            type: USER_AUTHENTICATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody;
        try {
            response = await fetch("/api/v1/me", reqOptions);
            if (!response.ok) throw new Error(`Сталася помилка під час авторизації`);
            respBody = await response.json();
            console.log(respBody);
        } catch (e) {
            console.log(e);
            localStorage.removeItem("jwt");
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { ...defaultPayload, error: { statusCode: response.status } }
            });
        }
        console.log(respBody);
        const userObject = respBody;
        dispatch({
            type: USER_AUTHENTICATE_SUCCESS,
            payload: { ...defaultPayload, userObject, isLogined: true },
        });  
    };
}