// @ts-check
import {
    INVOICES_GET_ALL_FAILURE,
    INVOICES_GET_ALL_REQUEST,
    INVOICES_GET_ALL_SUCCESS,
    defaultPayload    
} from './../actions/invoices';

import {
    USER_LOGOUT,
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function invoicesReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case INVOICES_GET_ALL_FAILURE:
        case INVOICES_GET_ALL_SUCCESS: {
            return {
                ...state, 
                invoicesObject: data.invoicesObject,
                isFetching: data.isFetching,
                error: data.error,
                searchField: data.searchField,
                typeOfQuery: data.typeOfQuery
            };
        }
        case INVOICES_GET_ALL_REQUEST: {
            return {
                ...state, 
                invoicesObject: state.invoicesObject,
                isFetching: data.isFetching,
                searchField: data.searchField,
                typeOfQuery: data.typeOfQuery
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

export default invoicesReducer;