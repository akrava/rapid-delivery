import { combineReducers } from 'redux';
import userReducer from './user';
import invoicesReducer from './invoices';
import invoiceReducer from './invoice';
import messageReducer from './showMessages';
import usersReducer from './users';
import registriesReducer from './registries'; 
import registryReducer from './registry';
import notifyReducer from './noyify';

const rootReducer = combineReducers({
    user: userReducer,
    users: usersReducer,
    registries: registriesReducer,
    registry: registryReducer,
    invoices: invoicesReducer,
    invoice: invoiceReducer,
    systemMessages: messageReducer,
    notify: notifyReducer
});

export default rootReducer;