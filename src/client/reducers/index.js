import { combineReducers } from 'redux';
import userReducer from './user';
import invoicesReducer from './invoices';
import messageReducer from './showMessages';
import usersReducer from './users';
  
const rootReducer = combineReducers({
    user: userReducer,
    users: usersReducer,
    invoices: invoicesReducer,
    systemMessages: messageReducer
});

export default rootReducer;