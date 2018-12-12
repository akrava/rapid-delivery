import {
    REGISTRIES_GET_ALL_FAILURE,
    REGISTRIES_GET_ALL_REQUEST,
    REGISTRIES_GET_ALL_SUCCESS,
    defaultPayload    
} from './../actions/registries';

import {
    USER_LOGOUT,
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function registriesReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case REGISTRIES_GET_ALL_FAILURE:
        case REGISTRIES_GET_ALL_SUCCESS: {
            return {
                ...state, 
                registriesObject: data.registriesObject,
                isFetching: data.isFetching,
                error: data.error,
                searchField: data.searchField
            };
        }
        case REGISTRIES_GET_ALL_REQUEST: {
            return {
                ...state, 
                registriesObject: state.registriesObject,
                isFetching: data.isFetching,
                searchField: data.searchField
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

export default registriesReducer;