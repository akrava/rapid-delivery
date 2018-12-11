import { CURRENT_PATH_REDIRECT, HISTORY_BROWSER_GO_BACK } from './../actions/redirect';
import history from './../configs/configureRouterHistory';

export const redirect = store => next => action => { //eslint-disable-line no-unused-vars
    if (action.type === CURRENT_PATH_REDIRECT) {
        history[action.payload.method](action.payload.path);
    } else if (action.type === HISTORY_BROWSER_GO_BACK) {
        history.goBack();
    }
    return next(action);
};