import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from './../../../actions/user';
import MenuLinks from './../../../components/partials/header/MenuLinks';
import UserStatusBar from './../../../components/partials/header/UserStatusBar';

class NavBar extends Component {
    static mapStateToProps(store) {
        return { user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { logout: () => dispatch(logout()) };
    }

    render() {
        const { user, logout } = this.props;
        return (
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <MenuLinks user={user} />
                <UserStatusBar user={user} logout={logout} />
            </div>
        );
    }
};

NavBar.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

export default withRouter(connect(NavBar.mapStateToProps, NavBar.mapDispatchToProps)(NavBar));