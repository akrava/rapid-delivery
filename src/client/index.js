import '@fortawesome/fontawesome-free/js/all';
import 'bootstrap';
import '@babel/polyfill';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ScrollContext } from 'react-router-scroll-4';
import App from  './components/App';
import store from './configs/configureReduxStore';
import history from './configs/configureRouterHistory';

const root = (
  <Provider store={store}>
    <BrowserRouter>
      <Router history={history}>
        <ScrollContext>
          <App />
        </ScrollContext>
      </Router>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(root, document.getElementById('root'));