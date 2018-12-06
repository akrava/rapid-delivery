import { 
    USER_AUTHENTICATE_REQUEST,
    USER_AUTHENTICATE_SUCCESS,
    USER_AUTHENTICATE_FAILURE 
} from './../actions/user';

const initialState = {
    isLogined: false,
    isFetching: false,
    jwt: null
};
  
function userReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case USER_AUTHENTICATE_REQUEST: {
            return { ...state, isFetching: true };
        }
        case USER_AUTHENTICATE_FAILURE: {
            return { ...state, error: { message: data.error, statusCode: data.statusCode } , isFetching: false };
        }
        case USER_AUTHENTICATE_SUCCESS: {
            return { ...state, jwt: data.jwt, userObject: data.userObject, isLogined: true, isFetching: false };
        }
        default: {
            return state;
        } 
    }
}

export default userReducer;