import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import AboutPage from './AboutPage';
import PageNotFound from './PageNotFound';

class Main extends Component {
  render() {
    return (
        <main className="container mt-4" role="main">
            <Switch>
                <Route exact path='/' component={HomePage}/>
                <Route path='/login' component={LoginPage} login={this.props.login} />
                <Route path='/about' component={AboutPage} />
                <Route component={PageNotFound}/>
            </Switch>
        </main>
    );
  }
}

Main.propTypes = {
    login: PropTypes.func.isRequired
};

export default Main;