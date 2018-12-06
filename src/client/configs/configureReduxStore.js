import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './../reducers/index';
import thunk from 'redux-thunk';

// DELETE ON PROD
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk)
);

const store = createStore(rootReducer, enhancer);

export default store;