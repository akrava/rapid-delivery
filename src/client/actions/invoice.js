// @ts-check
export const INVOICE_GET_REQUEST    = 'INVOICE_GET_REQUEST';
export const INVOICE_GET_FAILURE    = 'INVOICE_GET_FAILURE';
export const INVOICE_GET_SUCCESS    = 'INVOICE_GET_SUCCESS';
export const INVOICE_CREATE_REQUEST = 'INVOICE_CREATE_REQUEST';
export const INVOICE_CREATE_FAILURE = 'INVOICE_CREATE_FAILURE';
export const INVOICE_CREATE_SUCCESS = 'INVOICE_CREATE_SUCCESS';
export const INVOICE_UPDATE_REQUEST = 'INVOICE_UPDATE_REQUEST';
export const INVOICE_UPDATE_FAILURE = 'INVOICE_UPDATE_FAILURE';
export const INVOICE_UPDATE_SUCCESS = 'INVOICE_UPDATE_SUCCESS';
export const INVOICE_DELETE_REQUEST = 'INVOICE_DELETE_REQUEST';
export const INVOICE_DELETE_FAILURE = 'INVOICE_DELETE_FAILURE';
export const INVOICE_DELETE_SUCCESS = 'INVOICE_DELETE_SUCCESS';
import { showMessage, typesMessages } from './showMessage';
import Invoice from './../model/invoice';
import { CURRENT_PATH_REDIRECT } from './redirect';

export const defaultPayload = {
    invoiceObject: null,
    isFetching: false,
    error: ''
};

export function getInvoiceByNum(number) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: INVOICE_GET_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Invoice.getByNumber(jwt, number);
        if (response.statusCode === 404) {
            dispatch({
                type: CURRENT_PATH_REDIRECT,
                payload: {
                    method: 'replace', 
                    path: '/notFound'
                }
            });
            return dispatch({
                type: INVOICE_GET_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        if (response.error !== null) {
            showMessage(`Трапилась поимлка ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: INVOICE_GET_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        const invoice = response.respBody;
        dispatch({
            type: INVOICE_GET_SUCCESS,
            payload: { ...defaultPayload, invoiceObject: invoice },
        });
    };
}

export function createInvoice(formData) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: INVOICE_CREATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Invoice.create(jwt, formData);
        if (response.error !== null || response.statusCode !== 201) {
            showMessage("Не вдалося створити. Перевірте правильність даних", typesMessages.error)(dispatch);
            return dispatch({
                type: INVOICE_CREATE_FAILURE,
                payload: { ...defaultPayload, error: response.error ? response.error.message: 'error ocurred' }
            });
        }
        dispatch({
            type: INVOICE_CREATE_SUCCESS,
            payload: { ...defaultPayload, invoiceObject: response.respBody },
        }); 
        const num = response.respBody.data.number;
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: `/invoices/${num}`
            }
        });
        showMessage(`Успішно створено накладну #${num}`, typesMessages.success)(dispatch);
    }; 
}

export function updateInvoice(number, formData) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: INVOICE_UPDATE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Invoice.update(jwt, number, formData);
        if (response.error !== null) {
            showMessage("Не вдалося оновити. Перевірте правильність даних", typesMessages.error)(dispatch);
            return dispatch({
                type: INVOICE_UPDATE_FAILURE,
                payload: { ...defaultPayload, error: response.error ? response.error.message: 'error ocurred' }
            });
        }
        dispatch({
            type: INVOICE_UPDATE_SUCCESS,
            payload: { ...defaultPayload, invoiceObject: response.respBody },
        }); 
        const num = response.respBody.data.number;
        dispatch({
            type: CURRENT_PATH_REDIRECT,
            payload: {
                method: 'push', 
                path: `/invoices/${num}`
            }
        });
        showMessage(`Успішно оновлено накладну #${num}`, typesMessages.success)(dispatch);
    }; 
}

export function deleteInvoiceByNum(number) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: INVOICE_DELETE_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Invoice.deleteByNumber(jwt, number);
        if (response.statusCode === 204) {
            dispatch({
                type: INVOICE_DELETE_SUCCESS,
                payload: { ...defaultPayload, isFetching: false } }
            ); 
            showMessage(`Накладна #${number} була успішно видалена`, typesMessages.success)(dispatch);
            return dispatch({
                type: CURRENT_PATH_REDIRECT,
                payload: {
                    method: 'push', 
                    path: '/invoices'
                }
            });
        }
        showMessage(`Трапилась помилка ${response.error && response.error.message}`, typesMessages.error)(dispatch);
        return dispatch({
            type: INVOICE_DELETE_FAILURE,
            payload: { ...defaultPayload, error: response.error ? response.error.message : 'error' } }
        );
    };
}