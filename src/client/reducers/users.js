import {
    USERS_GET_ALL_FAILURE,
    USERS_GET_ALL_SUCCESS,
    USERS_GET_ALL_REQUEST,
    defaultPayload    
} from './../actions/users';

const initialState = {
    ...defaultPayload
};
  
function usersReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case USERS_GET_ALL_FAILURE:
        case USERS_GET_ALL_SUCCESS: {
            return {
                ...state, 
                usersObject: data.usersObject,
                isFetching: data.isFetching,
                error: data.error
            };
        }
        case USERS_GET_ALL_REQUEST: {
            console.log(state);
            return {
                ...state, 
                usersObject: state.usersObject,
                isFetching: data.isFetching
            };
        }
        default: {
            return state;
        } 
    }
}

export default usersReducer;