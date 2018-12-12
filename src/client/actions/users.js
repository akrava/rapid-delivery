// @ts-check
export const USERS_GET_ALL_REQUEST = 'USERS_GET_ALL_REQUEST';
export const USERS_GET_ALL_FAILURE = 'USERS_GET_ALL_FAILURE';
export const USERS_GET_ALL_SUCCESS = 'USERS_GET_ALL_SUCCESS';
import { showMessage, typesMessages } from './showMessage';
import User from './../model/user';

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
        const response = await User.getAll(jwt, page, limit);
        if (response.error !== null) {
            showMessage(`Трапилась поимлка ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: USERS_GET_ALL_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        const users = response.respBody;
        dispatch({
            type: USERS_GET_ALL_SUCCESS,
            payload: { ...defaultPayload, usersObject: users },
        });
    };
}