// @ts-check
export const REGISTRIES_GET_ALL_REQUEST = 'REGISTRIES_GET_ALL_REQUEST';
export const REGISTRIES_GET_ALL_FAILURE = 'REGISTRIES_GET_ALL_FAILURE';
export const REGISTRIES_GET_ALL_SUCCESS = 'REGISTRIES_GET_ALL_SUCCESS';
import { showMessage, typesMessages } from './showMessage';
import Registry from './../model/registry';

export const defaultPayload = {
    registriesObject: null,
    isFetching: false,
    error: '',
    searchField: ''
};

export function getAllRegistries(page, query, limit) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: REGISTRIES_GET_ALL_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Registry.getAll(jwt, page, query, limit);
        if (response.error !== null) {
            showMessage(`Трапилась поимлка ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: REGISTRIES_GET_ALL_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        const registiesInfo = response.respBody;
        dispatch({
            type: REGISTRIES_GET_ALL_SUCCESS,
            payload: { ...defaultPayload, registriesObject: registiesInfo, searchField: query },
        });
    };
}