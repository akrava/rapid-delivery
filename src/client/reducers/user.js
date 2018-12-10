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
    defaultPayload
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function userReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
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
        default: {
            return state;
        } 
    }
}

export default userReducer;