import {
    INVOICE_GET_FAILURE,
    INVOICE_GET_REQUEST,
    INVOICE_GET_SUCCESS,
    INVOICE_CREATE_FAILURE,
    INVOICE_CREATE_REQUEST,
    INVOICE_CREATE_SUCCESS,
    INVOICE_UPDATE_FAILURE,
    INVOICE_UPDATE_REQUEST,
    INVOICE_UPDATE_SUCCESS,
    INVOICE_DELETE_FAILURE,
    INVOICE_DELETE_REQUEST,
    INVOICE_DELETE_SUCCESS,
    defaultPayload    
} from './../actions/invoice';

import {
    USER_LOGOUT,
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function invoiceReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case INVOICE_UPDATE_FAILURE:
        case INVOICE_UPDATE_SUCCESS:
        case INVOICE_CREATE_FAILURE:
        case INVOICE_CREATE_REQUEST:
        case INVOICE_CREATE_SUCCESS: {
            return {
                ...state, 
                invoiceObject: data.invoiceObject,
                isFetching: data.isFetching,
                error: data.error
            };
        }
        case INVOICE_GET_FAILURE:
        case INVOICE_GET_SUCCESS: {
            return {
                ...state, 
                invoiceObject: data.invoiceObject,
                isFetching: data.isFetching,
                error: data.error
            };
        }
        case INVOICE_UPDATE_REQUEST:
        case INVOICE_GET_REQUEST: {
            return {
                ...state, 
                invoiceObject: state.invoiceObject,
                isFetching: data.isFetching
            };
        }
        case INVOICE_DELETE_REQUEST:
        case INVOICE_DELETE_FAILURE:
        case INVOICE_DELETE_SUCCESS: {
            return {
                ...state, 
                isFetching: data.isFetching,
                error: data.error
            };
        }
        case USER_LOGOUT: {
            return {
                ...defaultPayload
            };
        }
        default: {
            return state;
        }
    }
}

export default invoiceReducer;