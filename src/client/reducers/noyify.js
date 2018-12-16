import {
    NOTIFY_SEND_FAILURE,
    NOTIFY_SEND_REQUEST,
    NOTIFY_SEND_SUCCESS,
    defaultPayload    
} from './../actions/notify';

import {
    USER_LOGOUT,
} from './../actions/user';

const initialState = {
    ...defaultPayload
};
  
function notifyReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case NOTIFY_SEND_SUCCESS:
        case NOTIFY_SEND_FAILURE:
        case NOTIFY_SEND_REQUEST: {
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

export default notifyReducer;