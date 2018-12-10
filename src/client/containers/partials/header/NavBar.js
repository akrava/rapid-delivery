import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout, getUserFromJWT } from './../../../actions/user';
import MenuLinks from './../../../components/partials/header/MenuLinks';
import UserStatusBar from './../../../components/partials/header/UserStatusBar';
import MessagePopup from './../../../components/partials/header/MessagePopup';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.refButton = React.createRef();
        this.refMenu = React.createRef();
        this.changeNavItem = this.changeNavItem.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname){
            this.changeNavItem(); 
        }
    }

    changeNavItem() {
        if (this.refMenu.current.classList.contains("show"))
        this.refButton.current.click();
    }

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
                <button className="navbar-toggler" ref={this.refButton} type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div ref={this.refMenu} className="collapse navbar-collapse" id="navbarCollapse">
                    <MenuLinks user={user} />
                    <UserStatusBar user={user} logout={logout} />
                </div>
                <MessagePopup systemMessages={this.props.systemMessages} />
            </React.Fragment>
        );
    }
};

NavBar.propTypes = {
    location: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    systemMessages: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    initialLogin: PropTypes.func.isRequired
};

export default withRouter(connect(NavBar.mapStateToProps, NavBar.mapDispatchToProps)(NavBar));