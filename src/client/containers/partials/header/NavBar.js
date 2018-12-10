import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout, getUserFromJWT } from './../../../actions/user';
import MenuLinks from './../../../components/partials/header/MenuLinks';
import UserStatusBar from './../../../components/partials/header/UserStatusBar';
import MessagePopup from './../../../components/partials/header/MessagePopup';

class NavBar extends Component {
    componentDidMount() {
        this.props.initialLogin();     
    }

    static mapStateToProps(store) {
        return { user: store.user, systemMessages: store.systemMessages };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            logout: () => dispatch(logout()),
            initialLogin: () => dispatch(getUserFromJWT())
        };
    }

    render() {
        const { user, logout } = this.props;
        return (
            <React.Fragment>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <MenuLinks user={user} />
                    <UserStatusBar user={user} logout={logout} />
                </div>
                <MessagePopup systemMessages={this.props.systemMessages} />
            </React.Fragment>
        );
    }
};

NavBar.propTypes = {
    user: PropTypes.object.isRequired,
    systemMessages: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    initialLogin: PropTypes.func.isRequired
};

export default withRouter(connect(NavBar.mapStateToProps, NavBar.mapDispatchToProps)(NavBar));