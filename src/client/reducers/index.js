import { combineReducers } from 'redux';
import userReducer from './user';
import invoicesReducer from './invoices';
import messageReducer from './showMessages';
  
const rootReducer = combineReducers({
    user: userReducer,
    invoices: invoicesReducer,
    systemMessages: messageReducer
});

export default rootReducer;