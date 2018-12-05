import { combineReducers } from 'redux';
import userReducer from './user';
import invoicesReducer from './invoices';
  
const rootReducer = combineReducers({
    user: userReducer,
    invoices: invoicesReducer,
});

export default rootReducer;