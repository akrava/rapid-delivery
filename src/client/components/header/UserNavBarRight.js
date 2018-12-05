import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class UserNavBarRight extends Component {
    guestView() {
        return (
            <ul className="navbar-nav navbar-right">
                <div className="container center-block text-center">
                    <div className="row">
                        <div className="col d-md-inline-flex">
                            <Link role="button" to="/login" className="btn btn-primary btn-sm">Увійти</Link>
                            <Link role="button" to="/auth/register" className="btn btn-outline-primary ml-3 btn-sm">Зареєструватися</Link>
                        </div>
                    </div>
                </div>
            </ul>
        );
    }

    userView(user) {
        const { fullname, role, avaUrl } = user;
        return (
            <li className="nav-item dropdown align-middle">
                <a className="nav-link dropdown-toggle text-nowrap align-middle" href="" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={avaUrl} height="22" width="22" className="ava small align-middle"/>
                    {fullname}{role && <i className="far fa-star ml-1"></i>}
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown01">
                    <a className="dropdown-item" href="/users/me">Мій профіль</a>
                    <div className="dropdown-divider"></div>
                    <form action="/auth/logout" method="POST"><button className="dropdown-item pointer text-danger" type="submit"><i className="fas fa-sign-out-alt mr-1"></i>Вийти</button></form>
                </div>
            </li>
        );
    }

    render() {
        const user = this.props.user;
        return user.isLogined ? this.userView(user) : this.guestView();
    }
}

UserNavBarRight.propTypes = {
    user: PropTypes.shape({
        isLogined: PropTypes.bool.isRequired,
    })
};

export default UserNavBarRight;