import { 
    USER_AUTHENTICATE_REQUEST,
    USER_AUTHENTICATE_SUCCESS,
    USER_AUTHENTICATE_FAILURE,
    USER_LOGOUT,
    USER_REGISTER_USERNAME_REQUEST,
    USER_REGISTER_USERNAME_SUCCESS,
    USER_REGISTER_USERNAME_FAILURE,
    USER_REGISTER_FAILURE,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_FAILURE,
    USER_UPDATE_SUCCESS,
    ANOTHER_USER_FAILURE,
    ANOTHER_USER_REQUEST,
    ANOTHER_USER_SUCCESS,
    ANOTHER_USER_CHANGE_ROLE_FAILURE,
    ANOTHER_USER_CHANGE_ROLE_SUCCESS,
    ANOTHER_USER_CHANGE_ROLE_REQUEST,
    USER_CHANGE_PROFILE_FAILURE,
    USER_CHANGE_PROFILE_REQUEST,
    USER_CHANGE_PROFILE_SUCCESS,
    defaultPayload
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function userReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case USER_UPDATE_FAILURE:
        case USER_UPDATE_SUCCESS:
        case USER_AUTHENTICATE_REQUEST:
        case USER_AUTHENTICATE_FAILURE: 
        case USER_AUTHENTICATE_SUCCESS:
        case USER_LOGOUT: {
            return {
                ...state, 
                isFetching: data.isFetching,
                isLogined: data.isLogined,
                userObject: data.userObject,
                error: data.error, 
                success: data.success, 
            };
        }
        case USER_REGISTER_FAILURE:
        case USER_REGISTER_SUCCESS:
        case USER_REGISTER_REQUEST:  {
            return {
                ...state, 
                success: {
                    message: data.success.message
                },
                registration: {
                    isFetching: data.registration.isFetching,
                    error: data.registration.error,
                    username: state.registration.username
                }
            };
        }
        case USER_REGISTER_USERNAME_REQUEST:
        case USER_REGISTER_USERNAME_FAILURE:
        case USER_REGISTER_USERNAME_SUCCESS: {
            return {
                ...state, 
                registration: data.registration, 
            };
        }
        case ANOTHER_USER_CHANGE_ROLE_FAILURE:
        case ANOTHER_USER_CHANGE_ROLE_SUCCESS:
        case ANOTHER_USER_FAILURE:
        case ANOTHER_USER_REQUEST:
        case ANOTHER_USER_SUCCESS: {
            return {
                ...state, 
                requestedUserObject: data.requestedUserObject,
                requestedUserIsFetching: data.requestedUserIsFetching, 
            };
        }
        case ANOTHER_USER_CHANGE_ROLE_REQUEST:{
            return {
                ...state, 
                requestedUserObject: state.requestedUserObject,
                requestedUserIsFetching: data.requestedUserIsFetching, 
            };
        }
        case USER_CHANGE_PROFILE_SUCCESS: {
            return {
                ...state, 
                isFetching: data.isFetching,
                userObject: data.userObject
            };
        }
        case USER_CHANGE_PROFILE_FAILURE:
        case USER_CHANGE_PROFILE_REQUEST: {
            return {
                ...state, 
                isFetching: data.isFetching
            };
        }
        default: {
            return state;
        } 
    }
}

export default userReducer;