// @ts-check
export const REGISTRY_GET_REQUEST    = 'REGISTRY_GET_REQUEST';
export const REGISTRY_GET_FAILURE    = 'REGISTRY_GET_FAILURE';
export const REGISTRY_GET_SUCCESS    = 'REGISTRY_GET_SUCCESS';
export const REGISTRY_DELETE_REQUEST = 'REGISTRY_DELETE_REQUEST';
export const REGISTRY_DELETE_FAILURE = 'REGISTRY_DELETE_FAILURE';
export const REGISTRY_DELETE_SUCCESS = 'REGISTRY_DELETE_SUCCESS';
export const REGISTRY_CREATE_REQUEST = 'REGISTRY_CREATE_REQUEST';
export const REGISTRY_CREATE_FAILURE = 'REGISTRY_CREATE_FAILURE';
export const REGISTRY_CREATE_SUCCESS = 'REGISTRY_CREATE_SUCCESS';
export const REGISTRY_UPDATE_REQUEST = 'REGISTRY_UPDATE_REQUEST';
export const REGISTRY_UPDATE_FAILURE = 'REGISTRY_UPDATE_FAILURE';
export const REGISTRY_UPDATE_SUCCESS = 'REGISTRY_UPDATE_SUCCESS';
import { showMessage, typesMessages } from './showMessage';
import Registry from './../model/registry';
import { CURRENT_PATH_REDIRECT } from './redirect';

export const defaultPayload = {
    registryObject: null,
    isFetching: false,
    error: ''
};

export function getRegistryByNum(number) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: REGISTRY_GET_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Registry.getByNumber(jwt, number);
        if (response.statusCode === 404) {
            dispatch({
                type: CURRENT_PATH_REDIRECT,
                payload: {
                    method: 'replace', 
                    path: '/notFound'
                }
            });
            return dispatch({
                type: REGISTRY_GET_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        if (response.error !== null) {
            showMessage(`Трапилась поимлка ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: REGISTRY_GET_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        const registry = response.respBody;
        dispatch({
            type: REGISTRY_GET_SUCCESS,
            payload: { ...defaultPayload, registryObject: registry },
        });
    };
}

export function deleteRegistryByNum(number) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: REGISTRY_DELETE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Registry.deleteByNumber(jwt, number);
        if (response.statusCode === 204) {
            dispatch({
                type: REGISTRY_DELETE_SUCCESS,
                payload: { ...defaultPayload, isFetching: false } }
            ); 
            showMessage(`Реєстр та усі його накладні були успішно видалені`, typesMessages.success)(dispatch);
            return dispatch({
                type: CURRENT_PATH_REDIRECT,
                payload: {
                    method: 'push', 
                    path: '/registries'
                }
            });
        }
        showMessage(`Трапилась помилка ${response.error && response.error.message}`, typesMessages.error)(dispatch);
        return dispatch({
            type: REGISTRY_DELETE_FAILURE,
            payload: { ...defaultPayload, error: response.error ? response.error.message : 'error' } }
        );
    };
}

export function createRegistry(formData) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: REGISTRY_CREATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Registry.create(jwt, formData);
        if (response.error !== null || response.statusCode !== 201) {
            showMessage("Не вдалося створити. Перевірте правильність даних", typesMessages.error)(dispatch);
            return dispatch({
                type: REGISTRY_CREATE_FAILURE,
                payload: { ...defaultPayload, error: response.error ? response.error.message: 'error ocurred' }
            });
        }
        dispatch({
            type: REGISTRY_CREATE_SUCCESS,
            payload: { ...defaultPayload, registryObject: response.respBody },
        }); 
        const num = response.respBody.data.number;
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: `/registries/${num}`
            }
        });
        showMessage(`Успішно створено реєстр #${num}`, typesMessages.success)(dispatch);
    }; 
}

export function updateRegistry(number, formData) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: REGISTRY_UPDATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Registry.update(jwt, number, formData);
        if (response.error !== null) {
            showMessage("Не вдалося оновити. Перевірте правильність даних", typesMessages.error)(dispatch);
            return dispatch({
                type: REGISTRY_UPDATE_FAILURE,
                payload: { ...defaultPayload, error: response.error ? response.error.message: 'error ocurred' }
            });
        }
        dispatch({
            type: REGISTRY_UPDATE_SUCCESS,
            payload: { ...defaultPayload, registryObject: response.respBody },
        }); 
        const num = response.respBody.data.number;
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: `/registries/${num}`
            }
        });
        showMessage(`Успішно оновлено реєстр #${num}`, typesMessages.success)(dispatch);
    }; 
}