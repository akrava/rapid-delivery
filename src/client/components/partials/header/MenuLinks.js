import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { isAdmin, isStaffUser } from './../../../utils/service';

class MenuLinks extends Component {
    LoginedUserLinks(role) {
        const linkUsers = (
            <li className="nav-item">
                <NavLink className="nav-link text-nowrap pl-2 pl-md-auto" activeClassName="active" to='/users' exact>Користувачі</NavLink>
            </li>
        );
        const linkEntities = (admin) => {
            return (
                <React.Fragment>
                    <li className="nav-item">
                        <NavLink className="nav-link text-nowrap pl-2 pl-md-auto" activeClassName="active" to='/registries' exact>{ admin ? "Реєстри" : "Мої реєстри" }</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link text-nowrap pl-2 pl-md-auto" activeClassName="active" to='/invoices' exact>{ admin ? "Транспортні накладні" : "Мої транспортні накладні" }</NavLink>
                    </li>
                </React.Fragment>
            );
        };
        const linkPanel = (
            <li className="nav-item">
                <NavLink className="nav-link text-nowrap pl-2 pl-md-auto" activeClassName="active" to='/hmm'>Hmmm</NavLink>
            </li>
        );
        if (role < 0) return null;
        return ( 
            <React.Fragment>
                { isAdmin(role) && linkUsers }
                { isStaffUser(role) ? linkPanel : linkEntities(isAdmin(role)) }
            </React.Fragment>
        );
    }
    
    render() {
        const { isLogined } = this.props.user;
        let role = -1;
        if (isLogined) {
            role = this.props.user.userObject.role;
        }
        return (
            <ul className="navbar-nav mr-auto my-2 my-md-0">
                <li className="nav-item">
                    <NavLink className="nav-link text-nowrap pl-2 pl-md-auto" activeClassName="active" to='/' exact={true}>Головна</NavLink>
                </li>
                {this.LoginedUserLinks(role)}
                <li className="nav-item">
                    <NavLink className="nav-link text-nowrap pl-2 pl-md-auto" activeClassName="active" to='/about'>Про компанію</NavLink>
                </li>
            </ul>
        );
    }
}

MenuLinks.propTypes = {
    user: PropTypes.shape({
        isLogined: PropTypes.bool.isRequired,
        userObject: PropTypes.object
    })
};

export default MenuLinks;