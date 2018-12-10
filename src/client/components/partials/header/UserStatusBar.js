import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isAdmin, isStaffUser } from './../../../utils/service';

class UserStatusBar extends Component {
    guestView() {
        return (
            <div className="container center-block text-center">
                <div className="row">
                    <div className="col d-md-inline-flex">
                        <Link role="button" to="/login" className="btn btn-primary btn-sm">Увійти</Link>
                        <Link role="button" to="/register" className="btn btn-outline-primary ml-3 btn-sm">Зареєструватися</Link>
                    </div>
                </div>
            </div>
        );
    }

    userView(user) {
        const { fullname, role, avaUrl } = user;
        return (
            <li className="nav-item dropdown align-middle">
                <a className="nav-link dropdown-toggle text-nowrap align-middle pointer" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={ avaUrl } height="22" width="22" className="ava small align-middle mr-1"/>
                    { fullname }<span>{ isAdmin(role) && <i className="far fa-star ml-1"></i> }</span>
                    <span>{ isStaffUser(role) && <i className="fas fa-user-cog ml-1"></i> }</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">
                    <Link className="dropdown-item" to="/users/me">Мій профіль</Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={this.props.logout} className="dropdown-item pointer text-danger" type="submit"><i className="fas fa-sign-out-alt mr-1"></i>Вийти</button>
                </div>
            </li>
        );
    }

    render() {
        const { isLogined, userObject: user } = this.props.user;
        return (
            <ul className="navbar-nav navbar-right">
                { isLogined ? this.userView(user) : this.guestView() }
            </ul>
        );
    }
}

UserStatusBar.propTypes = {
    user: PropTypes.shape({
        isLogined: PropTypes.bool.isRequired,
        userObject: PropTypes.object
    }),
    logout: PropTypes.func.isRequired
};

export default UserStatusBar;