export const NOTIFY_SEND_REQUEST = 'NOTIFY_SEND_REQUEST';
export const NOTIFY_SEND_FAILURE = 'NOTIFY_SEND_FAILURE';
export const NOTIFY_SEND_SUCCESS = 'NOTIFY_SEND_SUCCESS';
import { showMessage, typesMessages } from './showMessage';
import Notify from './../model/notify';

export const defaultPayload = { 
    isFetching: false,
    error: '',
};

export function sendNotification(message, isImportant) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: NOTIFY_SEND_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const formData = new FormData();
        formData.append("message", message);
        formData.append("isImportant", isImportant);
        const response = await Notify.sendNotification(jwt, formData);
        if (response.error !== null || response.statusCode !== 204) {
            showMessage(`Невдалося відправити ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: NOTIFY_SEND_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        showMessage(`Повідомлення було відправлено успішно`, typesMessages.success)(dispatch);
        dispatch({
            type: NOTIFY_SEND_SUCCESS,
            payload: { ...defaultPayload },
        });
    };
}