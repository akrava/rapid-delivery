import { createStore } from 'redux';
import rootReducer from './../reducers/index';

// DELETE ON PROD
// import { createStore, applyMiddleware, compose } from 'redux';

// + const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// + const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
// - const store = createStore(reducer, /* preloadedState, */ compose(
//     applyMiddleware(...middleware)
//   ));

const store = createStore(rootReducer, ...[], window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;