import 'bootstrap';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createBrowserHistory from "history/createBrowserHistory";
import App from  './containers/App';
import store from './configs/configureReduxStore';

const history = createBrowserHistory();

const root = (
  <Provider store={store}>
    <BrowserRouter>
      <Router history={history}>
        <App />
      </Router>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(root, document.getElementById('root'));