import { MESSAGE_SHOW, MESSAGE_HIDE, defaultPayload } from './../actions/showMessage';

const initialState = {
    ...defaultPayload
};
  
function messageReducer(state = initialState, action) {
    const data = action.payload;
    switch (action.type) {
        case MESSAGE_SHOW: {
            return {
                ...state, 
                text: data.text,
                type: data.type,
                isViewing: data.isViewing
            };
        }
        case MESSAGE_HIDE: {
            return {
                ...state,
                isViewing: data.isViewing
            };
        }
        default: {
            return state;
        } 
    }
}

export default messageReducer;