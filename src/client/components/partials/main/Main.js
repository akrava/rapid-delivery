import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import ErrorBoundary from './../../special/ErrorBoundary';
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
import RegistryPage from './../../../containers/registry/RegistryPage';
import EditRegistry from './../../../containers/registry/EditRegistry';
import NewRegistry from './../../../containers/registry/NewRegistry';
import InvoicesTable from '../../../containers/invoices/InvoicesTable';
import InvoicePage from './../../../containers/invoice/InvoicePage';
import NewInvoice from './../../../containers/invoice/NewInvoice';
import EditInvoice from './../../../containers/invoice/EditInvoice';
import DeveloperPage from './../../developer/DeveloperPage';

class Main extends Component {
  render() {
    return (
        <main className="container mt-4" role="main">
            <Breadcrumbs />
            <ErrorBoundary>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                        <Route path='/about' component={AboutPage}/>
                        <Route exact path='/users' component={AuthenticatedComponent(UsersPage, [isAdmin])}/>
                            <Route exact path='/users/me' component={AuthenticatedComponent(MyUserPage, false)}/>
                                <Route path='/users/me/edit' component={AuthenticatedComponent(EditUserPage, false)} />
                            <Route path='/users/:username([A-Za-z_0-9]{5,20})' component={AuthenticatedComponent(UserPage, [isAdmin])}/>
                        <Route exact path='/registries/' component={AuthenticatedComponent(RegistriesTable, [isAdmin, isDefaultUser])}/>
                            <Route exact path='/registries/:number(\d{5})' component={AuthenticatedComponent(RegistryPage, [isAdmin, isDefaultUser])}/>
                                <Route path='/registries/:number(\d{5})/edit' component={AuthenticatedComponent(EditRegistry, [isAdmin, isDefaultUser])}/>
                            <Route path='/registries/new' component={AuthenticatedComponent(NewRegistry, [isAdmin, isDefaultUser])}/>
                        <Route exact path='/invoices/' component={AuthenticatedComponent(InvoicesTable, [isAdmin, isDefaultUser])}/>
                            <Route exact path='/invoices/:number(\d{6})' component={AuthenticatedComponent(InvoicePage, [isAdmin, isDefaultUser])}/>
                                <Route path='/invoices/:number(\d{6})/edit' component={AuthenticatedComponent(EditInvoice, [isAdmin, isDefaultUser])}/>
                            <Route path='/invoices/new' component={AuthenticatedComponent(NewInvoice, [isAdmin, isDefaultUser])}/>
                        <Route path='/login' component={LoginPage} />
                        <Route path='/register' component={RegisterPage}/>
                        <Route path='/developer/v1' component={DeveloperPage} />
                        <Route component={PageNotFound}/>
                </Switch>
            </ErrorBoundary>
        </main>
    );
  }
}

export default Main;