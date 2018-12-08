import { 
    USER_AUTHENTICATE_REQUEST,
    USER_AUTHENTICATE_SUCCESS,
    USER_AUTHENTICATE_FAILURE,
    USER_LOGOUT,
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
        default: {
            return state;
        } 
    }
}

export default userReducer;