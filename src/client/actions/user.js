// @ts-check
export const USER_AUTHENTICATE_REQUEST        = 'USER_AUTHENTICATE_REQUEST';
export const USER_AUTHENTICATE_SUCCESS        = 'USER_AUTHENTICATE_SUCCESS';
export const USER_AUTHENTICATE_FAILURE        = 'USER_AUTHENTICATE_FAILURE';
export const USER_LOGOUT                      = 'USER_LOGOUT';
export const USER_REGISTER_REQUEST            = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_SUCCESS            = 'USER_REGISTER_SUCCESS';
export const USER_REGISTER_FAILURE            = 'USER_REGISTER_FAILURE';
export const USER_REGISTER_USERNAME_REQUEST   = 'USER_REGISTER_USERNAME_REQUEST';
export const USER_REGISTER_USERNAME_FAILURE   = 'USER_REGISTER_USERNAME_FAILURE';
export const USER_REGISTER_USERNAME_SUCCESS   = 'USER_REGISTER_USERNAME_SUCCESS';
export const USER_UPDATE_REQUEST              = 'USER_UPDATE_REQUEST';
export const USER_UPDATE_SUCCESS              = 'USER_UPDATE_SUCCESS';
export const USER_UPDATE_FAILURE              = 'USER_UPDATE_FAILURE';
export const USER_CHANGE_PROFILE_REQUEST      = 'USER_CHANGE_PROFILE_REQUEST';
export const USER_CHANGE_PROFILE_SUCCESS      = 'USER_CHANGE_PROFILE_SUCCESS';
export const USER_CHANGE_PROFILE_FAILURE      = 'USER_CHANGE_PROFILE_FAILURE';
export const ANOTHER_USER_REQUEST             = 'ANOTHER_USER_REQUEST';
export const ANOTHER_USER_SUCCESS             = 'ANOTHER_USER_SUCCESS';
export const ANOTHER_USER_FAILURE             = 'ANOTHER_USER_FAILURE';
export const ANOTHER_USER_CHANGE_ROLE_REQUEST = 'ANOTHER_USER_CHANGE_ROLE_REQUEST';
export const ANOTHER_USER_CHANGE_ROLE_SUCCESS = 'ANOTHER_USER_CHANGE_ROLE_SUCCESS';
export const ANOTHER_USER_CHANGE_ROLE_FAILURE = 'ANOTHER_USER_CHANGE_ROLE_FAILURE';

import User from './../model/user';
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
        const response = await User.authenticate(login, password);
        if (response.error !== null) {
            showMessage("Неправильний логін або пароль", typesMessages.error)(dispatch);
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { ...defaultPayload, error: { message: response.error.message, statusCode: response.statusCode } }
            });
        }
        const jwt = response.respBody.token;
        localStorage.setItem("jwt", jwt); 
        const userObject = response.respBody.user;
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
        const response = await User.me(jwt);
        if (response.error !== null) {
            localStorage.removeItem("jwt");
            return dispatch({
                type: USER_AUTHENTICATE_FAILURE,
                payload: { ...defaultPayload, error: { statusCode: response.statusCode } }
            });
        } 
        const userObject = response.respBody;
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
        const response = await User.create(formData);
        if (response.error !== null) {
            showMessage("Некоректні данні. Перевірте правильність", typesMessages.error)(dispatch);
            return dispatch({
                type: USER_REGISTER_FAILURE,
                payload: { ...defaultPayload, registration: { error: response.error.message || "error ocurred" } }
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
        const response = await User.isFreeLogin(username);
        if (response.error !== null) {
            return dispatch({
                type: USER_REGISTER_USERNAME_FAILURE,
                payload: { ...defaultPayload, registration: { username: { error: response.error.message || "error ocurred" },  isFetching: false  } }
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
        const response = await User.me(jwt);
        if (response.error !== null) {
            showMessage("Невдалося отримати інфориацію", typesMessages.error)(dispatch);
            return dispatch({
                type: USER_UPDATE_FAILURE,
                payload: { ...defaultPayload, error: { statusCode: response.statusCode } }
            });
        }
        const userObject = response.respBody;
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
        const response = await User.getByLogin(jwt, username);
        if (response.statusCode === 404) {
            return dispatch({
                type: CURRENT_PATH_REDIRECT,
                payload: {
                    method: 'replace', 
                    path: '/notFound'
                }
            }); 
        }
        if (response.error !== null) {
            showMessage("Невдалося отримати інформацію", typesMessages.error)(dispatch);
            return dispatch({
                type: ANOTHER_USER_FAILURE,
                payload: { ...defaultPayload, requestedUserIsFetching: false }
            });
        }
        const userObject = response.respBody.data;
        dispatch({
            type: ANOTHER_USER_SUCCESS,
            payload: { ...defaultPayload, requestedUserObject: userObject },
        });  
    };
}

export function changeUserRole(username, role) {
    const jwt = localStorage.getItem('jwt');
    if (jwt === null) {
        return {
            type: 'JWT_NOT_FOUND',
            payload: {}
        };
    }
    return async function(dispatch) { 
        dispatch({ 
            type: ANOTHER_USER_CHANGE_ROLE_REQUEST,
            payload: { ...defaultPayload, requestedUserIsFetching: true }
        });
        const response = await User.updateByLogin(jwt, username, role, true);
        if (response.error !== null) {
            showMessage(`Невдалося змінити роль ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: ANOTHER_USER_CHANGE_ROLE_FAILURE,
                payload: { ...defaultPayload, requestedUserIsFetching: false }
            });
        }
        const userObject = response.respBody.data;
        showMessage(`Роль було змінено успішно`, typesMessages.success)(dispatch);
        dispatch({
            type: ANOTHER_USER_CHANGE_ROLE_SUCCESS,
            payload: { ...defaultPayload, requestedUserObject: userObject },
        });  
    };
}

export function changeMyPersonalInfo(username, formData) {
    const jwt = localStorage.getItem('jwt');
    if (jwt === null) {
        return {
            type: 'JWT_NOT_FOUND',
            payload: {}
        };
    }
    return async function(dispatch) {
        dispatch({ 
            type: USER_CHANGE_PROFILE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await User.updateByLogin(jwt, username, formData, false);
        if (response.statusCode === 406) {
            showMessage(`Пароль введено невірно`, typesMessages.error)(dispatch);
            return dispatch({
                type: USER_CHANGE_PROFILE_FAILURE,
                payload: { ...defaultPayload, isFetching: false }
            });
        }
        if (response.error !== null) {
            showMessage(`Перевірте корректність введених даних`, typesMessages.error)(dispatch);
            return dispatch({
                type: USER_CHANGE_PROFILE_FAILURE,
                payload: { ...defaultPayload, isFetching: false }
            });
        }
        const userObject = response.respBody.data;
        showMessage(`Профіль було успішно онвлено`, typesMessages.success)(dispatch);
        dispatch({
            type: USER_CHANGE_PROFILE_SUCCESS,
            payload: { ...defaultPayload, userObject: userObject },
        });
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: '/users/me'
            }
        });
    };
}