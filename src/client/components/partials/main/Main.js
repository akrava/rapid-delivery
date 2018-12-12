import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
//import { IndexRoute } from 'react-router'
// import PropTypes from 'prop-types';
import HomePage from '../../index/HomePage';
import LoginPage from '../../../containers/login/LoginPage';
import RegisterPage from './../../../containers/register/RegisterPage';
import AboutPage from '../../about/AboutPage';
import UsersPage from './../../users/UsersPage';
import PageNotFound from '../../special/PageNotFound';
import Breadcrumbs from './../../../containers/partials/main/Breadcrumbs';
import AuthenticatedComponent from './../../../containers/special/AuthenticatedComponent';
import MyUserPage from './../../../containers/user/MyUserPage';
import UserPage from './../../../containers/user/UserPage';
import EditUserPage from './../../../containers/user/EditUserPage';
import RegistriesTable from './../../../containers/registries/RegistriesTable';
import { isAdmin, isDefaultUser } from './../../../utils/service';

class Main extends Component {
  render() {
    return (
        <main className="container mt-4" role="main">
            <Breadcrumbs />
            <Switch>
                <Route exact path='/' component={HomePage}/>
                    <Route path='/about' component={AboutPage}/>
                    <Route exact path='/users' component={AuthenticatedComponent(UsersPage, [isAdmin])}/>
                        <Route exact path='/users/me' component={AuthenticatedComponent(MyUserPage, false)}/>
                            <Route path='/users/me/edit' component={AuthenticatedComponent(EditUserPage, false)} />
                        <Route path='/users/:username([A-Za-z_0-9]{5,20})' component={AuthenticatedComponent(UserPage, [isAdmin])}/>
                    <Route exact path='/registries/' component={AuthenticatedComponent(RegistriesTable, [isAdmin, isDefaultUser])}/>
                        <Route path='/registries/:registry' component={HomePage}/>
                    <Route path='/invoices/:invoice' component={HomePage}/>
                    <Route path='/login' component={LoginPage} />
                    <Route path='/register' component={RegisterPage}/>
                <Route component={PageNotFound}/>
            </Switch>
        </main>
    );
  }
}

export default Main;