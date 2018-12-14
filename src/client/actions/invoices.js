// @ts-check
export const INVOICES_GET_ALL_REQUEST = 'INVOICES_GET_ALL_REQUEST';
export const INVOICES_GET_ALL_FAILURE = 'INVOICES_GET_ALL_FAILURE';
export const INVOICES_GET_ALL_SUCCESS = 'INVOICES_GET_ALL_SUCCESS';
import { showMessage, typesMessages } from './showMessage';
import Invoice from './../model/invoice';

export const defaultPayload = {
    invoicesObject: null,
    isFetching: false,
    error: '',
    searchField: '',
    typeOfQuery: ''
};

export function getAllInvoices(page, query, type, limit) {
    const jwt = localStorage.getItem('jwt');
    return async function(dispatch) { 
        dispatch({ 
            type: INVOICES_GET_ALL_REQUEST,
            payload: { ...defaultPayload, isFetching: true }
        });
        const response = await Invoice.getAll(jwt, page, query, type, limit);
        if (response.error !== null) {
            showMessage(`Трапилась поимлка ${response.error.message}`, typesMessages.error)(dispatch);
            return dispatch({
                type: INVOICES_GET_ALL_FAILURE,
                payload: { ...defaultPayload, error: response.error.message } }
            );
        }
        const invoices = response.respBody;
        dispatch({
            type: INVOICES_GET_ALL_SUCCESS,
            payload: { ...defaultPayload, invoicesObject: invoices, searchField: query, typeOfQuery: type  },
        });
    };
}