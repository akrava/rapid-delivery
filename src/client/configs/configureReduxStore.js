import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './../reducers/index';
import thunk from 'redux-thunk';
import { redirect } from './../middlewares/redirect';

// DELETE ON PROD
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(redirect)
);

const store = createStore(rootReducer, enhancer);

export default store;