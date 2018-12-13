import {
    REGISTRY_GET_FAILURE,
    REGISTRY_GET_REQUEST,
    REGISTRY_GET_SUCCESS,
    REGISTRY_DELETE_FAILURE,
    REGISTRY_DELETE_REQUEST,
    REGISTRY_DELETE_SUCCESS,
    defaultPayload    
} from './../actions/registry';

import {
    USER_LOGOUT,
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function registryReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case REGISTRY_GET_FAILURE:
        case REGISTRY_GET_SUCCESS: {
            return {
                ...state, 
                registryObject: data.registryObject,
                isFetching: data.isFetching,
                error: data.error
            };
        }
        case REGISTRY_GET_REQUEST: {
            return {
                ...state, 
                registryObject: state.registryObject,
                isFetching: data.isFetching
            };
        }
        case REGISTRY_DELETE_REQUEST:
        case REGISTRY_DELETE_FAILURE:
        case REGISTRY_DELETE_SUCCESS: {
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

export default registryReducer;