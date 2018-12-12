import { combineReducers } from 'redux';
import userReducer from './user';
import invoicesReducer from './invoices';
import messageReducer from './showMessages';
import usersReducer from './users';
import registriesReducer from './registries'; 

const rootReducer = combineReducers({
    user: userReducer,
    users: usersReducer,
    registries: registriesReducer,
    invoices: invoicesReducer,
    systemMessages: messageReducer
});

export default rootReducer;