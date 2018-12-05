import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './../components/Header';
import Main from './../components/Main';
import Footer from './../components/Footer';
import { authenticate } from './../actions/user';

class App extends Component {

    static mapStateToProps(store) {
        console.log(store);
        return {
            user: store.user,
            invoices: store.invoices
        };
    }

    static mapDispatchToProps(dispatch) {
        return {
            login: (login, password) => dispatch(authenticate(login, password))
        };
      }

    render() {
        const { user, login } = this.props;
        const locationPath = this.props.location.pathname;
        return (
            <React.Fragment>
                <Header user={user} login={login} locationPath={locationPath} />
                <Main login={login} />
                <Footer />
            </React.Fragment>
        );
    }
};

App.propTypes = {
    user: PropTypes.object.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }),
    login: PropTypes.func.isRequired
};

export default withRouter(connect(App.mapStateToProps, App.mapDispatchToProps)(App));