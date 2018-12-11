export const USER_AUTHENTICATE_REQUEST      = 'USER_AUTHENTICATE_REQUEST';
export const USER_AUTHENTICATE_SUCCESS      = 'USER_AUTHENTICATE_SUCCESS';
export const USER_AUTHENTICATE_FAILURE      = 'USER_AUTHENTICATE_FAILURE';
export const USER_LOGOUT                    = 'USER_LOGOUT';
export const USER_REGISTER_REQUEST          = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_SUCCESS          = 'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAILURE          = 'USER_REGISTER_FAILURE';
export const USER_REGISTER_USERNAME_REQUEST = 'USER_REGISTER_USERNAME_REQUEST';
export const USER_REGISTER_USERNAME_FAILURE = 'USER_REGISTER_USERNAME_FAILURE';
export const USER_REGISTER_USERNAME_SUCCESS = 'USER_REGISTER_USERNAME_SUCCESS';
export const USER_UPDATE_REQUEST            = 'USER_UPDATE_REQUEST';
export const USER_UPDATE_SUCCESS            = 'USER_UPDATE_SUCCESS';
export const USER_UPDATE_FAILURE            = 'USER_UPDATE_FAILURE';
export const ANOTHER_USER_REQUEST           = 'ANOTHER_USER_REQUEST';
export const ANOTHER_USER_SUCCESS           = 'ANOTHER_USER_SUCCESS';
export const ANOTHER_USER_FAILURE           = 'ANOTHER_USER_FAILURE';
import { authorizationHeaders, formDataToJson } from './../utils/service';
import { CURRENT_PATH_REDIRECT } from './redirect';
import { showMessage, typesMessages } from './showMessage';

export const defaultPayload = {
    isFetching: false,
    isLogined: false,
    userObject: null,
    requestedUserObject: null,
    requestedUserIsFetching: false,
    error: { 
        message: false, 
        statusCode: false
    },
    success: {
        message: false
    },
    registration: {
        isFetching: false,
        error: false,
        username: {
            isFetching: false,
            error: false,
            success: false
        }
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
            showMessage("Неправильний логін або пароль", typesMessages.error)(dispatch);
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { ...defaultPayload, error: { message: e.message, statusCode: response.status } }
            });
        }
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
        } catch (e) {
            localStorage.removeItem("jwt");
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { ...defaultPayload, error: { statusCode: response.status } }
            });
        }
        const userObject = respBody;
        dispatch({
            type: USER_AUTHENTICATE_SUCCESS,
            payload: { ...defaultPayload, userObject, isLogined: true },
        });  
    };
}

export function register(formData) {
    return async function(dispatch) { 
        dispatch({ 
            type: USER_REGISTER_REQUEST,
            payload: { ...defaultPayload, registration: { isFetching: true } }
        });
        let response;
        try {
            response = await fetch("/api/v1/users", { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: formDataToJson(formData)
            });
            if (!response.ok || response.status !== 201) throw new Error(`Сталася помилка під час реєстрації`);
        } catch (e) {
            showMessage("Некоректні данні. Перевірте правильність", typesMessages.error)(dispatch);
            return dispatch({
                type: USER_REGISTER_FAILURE,
                payload: { ...defaultPayload, registration: { error: e.message || "error ocurred" } }
            });
        }
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: { ...defaultPayload, success: { message: "Успішно зареєстровано" } },
        }); 
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: '/login'
            }
        });
        showMessage("Успішно зареєстровано", typesMessages.success)(dispatch);
    }; 
}

export function checkUsername(username) {
    return async function(dispatch) { 
        dispatch({ 
            type: USER_REGISTER_USERNAME_REQUEST,
            payload: { ...defaultPayload, registration: { username: {  isFetching: true },  isFetching: false } }
        });
        let response;
        try {
            response = await fetch(`/api/v1/users/${encodeURIComponent(username)}`, { 
                method: "HEAD"
            });
            if (!response.ok || response.status !== 200) throw new Error(`Логін вже існує`);
        } catch (e) {
            return dispatch({
                type: USER_REGISTER_USERNAME_FAILURE,
                payload: { ...defaultPayload, registration: { username: { error: e.message || "error ocurred" },  isFetching: false  } }
            });
        }
        dispatch({
            type: USER_REGISTER_USERNAME_SUCCESS,
            payload: { ...defaultPayload, registration: { username: { success: "Доступне" },  isFetching: false  } },
        });
    }; 
}

export function updateInfoAboutMe() {
    const jwt = localStorage.getItem('jwt');
    if (jwt === null) {
        return {
            type: 'JWT_NOT_FOUND',
            payload: {}
        };
    }
    return async function(dispatch) { 
        dispatch({ 
            type: USER_UPDATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody;
        try {
            response = await fetch("/api/v1/me", reqOptions);
            if (!response.ok) throw new Error(`Сталася помилка під час авторизації`);
            respBody = await response.json();
        } catch (e) {
            showMessage("Невдалося отримати інфориацію", typesMessages.error)(dispatch);
            return dispatch({
                type: USER_UPDATE_FAILURE,
                payload: { ...defaultPayload, error: { statusCode: response.status } }
            });
        }
        const userObject = respBody;
        dispatch({
            type: USER_UPDATE_SUCCESS,
            payload: { ...defaultPayload, userObject, isLogined: true },
        });  
    };
}

export function getInfoAboutUser(username) {
    const jwt = localStorage.getItem('jwt');
    if (jwt === null) {
        return {
            type: 'JWT_NOT_FOUND',
            payload: {}
        };
    }
    return async function(dispatch) { 
        dispatch({ 
            type: ANOTHER_USER_REQUEST,
            payload: { ...defaultPayload, requestedUserIsFetching: true }
        });
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody;
        try {
            response = await fetch(`/api/v1/users/${encodeURIComponent(username)}`, reqOptions);
            if (response.status === 404) {
                return dispatch({
                    type: CURRENT_PATH_REDIRECT,
                    payload: {
                        method: 'replace', 
                        path: '/notFound'
                    }
                }); 
            }
            if (!response.ok) throw new Error(`Сталася помилка під час авторизації`);
            respBody = await response.json();
        } catch (e) {
            showMessage("Невдалося отримати інформацію", typesMessages.error)(dispatch);
            return dispatch({
                type: ANOTHER_USER_FAILURE,
                payload: { ...defaultPayload, requestedUserIsFetching: false }
            });
        }
        const userObject = respBody.data;
        dispatch({
            type: ANOTHER_USER_SUCCESS,
            payload: { ...defaultPayload, requestedUserObject: userObject },
        });  
    };
}