import { CURRENT_PATH_REDIRECT } from './../actions/redirect';
import history from './../configs/configureRouterHistory';

export const redirect = store => next => action => { //eslint-disable-line no-unused-vars
    if (action.type === CURRENT_PATH_REDIRECT) {
        history[action.payload.method](action.payload.path);
    }
    return next(action);
};