import {
    REGISTRY_GET_FAILURE,
    REGISTRY_GET_REQUEST,
    REGISTRY_GET_SUCCESS,
    REGISTRY_DELETE_FAILURE,
    REGISTRY_DELETE_REQUEST,
    REGISTRY_DELETE_SUCCESS,
    REGISTRY_CREATE_FAILURE,
    REGISTRY_CREATE_REQUEST,
    REGISTRY_CREATE_SUCCESS,
    REGISTRY_UPDATE_FAILURE,
    REGISTRY_UPDATE_REQUEST,
    REGISTRY_UPDATE_SUCCESS,
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
        case REGISTRY_UPDATE_FAILURE:
        case REGISTRY_UPDATE_REQUEST:
        case REGISTRY_UPDATE_SUCCESS:
        case REGISTRY_CREATE_FAILURE:
        case REGISTRY_CREATE_REQUEST:
        case REGISTRY_CREATE_SUCCESS: {
            return {
                ...state, 
                registryObject: data.registryObject,
                isFetching: data.isFetching,
                error: data.error
            };
        }
        default: {
            return state;
        } 
    }
}

export default registryReducer;