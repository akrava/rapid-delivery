import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
//import { IndexRoute } from 'react-router'
// import PropTypes from 'prop-types';
import HomePage from '../../index/HomePage';
import LoginPage from '../../../containers/login/LoginPage';
import RegisterPage from './../../../containers/register/RegisterPage';
import AboutPage from '../../about/AboutPage';
import PageNotFound from '../../special/PageNotFound';
import Breadcrumbs from './../../../containers/partials/main/Breadcrumbs';


class Main extends Component {
  render() {
    return (
        <main className="container mt-4" role="main">
            <Breadcrumbs />
            <Switch>
                <Route exact path='/' component={HomePage}/>
                <Route path='/about' component={AboutPage}/>
                <Route path='/invoices/:invoice' component={HomePage}/>
                <Route path='/registries/:registry' component={HomePage}/>
                <Route path='/login' component={LoginPage} />
                <Route path='/register' component={RegisterPage}/>
                <Route component={PageNotFound}/>
            </Switch>
        </main>
    );
  }
}

export default Main;