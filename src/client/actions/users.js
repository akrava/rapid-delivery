export const USERS_GET_ALL_REQUEST = 'USERS_GET_ALL_REQUEST';
export const USERS_GET_ALL_FAILURE = 'USERS_GET_ALL_FAILURE';
export const USERS_GET_ALL_SUCCESS = 'USERS_GET_ALL_SUCCESS';
import url from 'url';
import { authorizationHeaders } from './../utils/service';
import { showMessage, typesMessages } from './showMessage';

export const defaultPayload = {
    usersObject: null,
    isFetching: false,
    error: '',
};

export function getAllUsers(page, limit) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: USERS_GET_ALL_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const reqOptions = authorizationHeaders(jwt);
        reqOptions.method = 'GET';
        let response, respBody;
        try {
            response = await fetch(`/api/v1/users${url.format({query: {page, limit}})}`, reqOptions);
            if (!response.ok) throw new Error(response.statusText);
            respBody = await response.json();
        } catch (e) {
            showMessage(`Трапилась поимлка ${e.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: USERS_GET_ALL_FAILURE,
                payload: { ...defaultPayload, error: e.message } }
            );
        }
        const users = respBody;
        dispatch({
            type: USERS_GET_ALL_SUCCESS,
            payload: { ...defaultPayload, usersObject: users },
        });
    };
}