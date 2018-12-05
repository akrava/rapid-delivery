import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UserNavBarRight from "./header/UserNavBarRight";

const links = [
    {
        link: "/",
        text: "Головна"
    },
    {
        link: "/about",
        text: "Про компанію"
    }
];

class LinkEl extends Component {
    render() {
        const { link, text, current } = this.props.data;
        return (
            <li className={"nav-item" + (current ? " active" : "")}>
                <Link className="nav-link text-nowrap" to={link}>{text} {current ? <span className="sr-only">(current)</span> : null }</Link>
            </li>
        );
    }
}

LinkEl.propTypes = {
    data: PropTypes.shape({
        link: PropTypes.string.isRequired, 
        text: PropTypes.string.isRequired,
        current: PropTypes.bool.isRequired
    })
};

class MenuLinks extends Component {
    static get propTypes() {
        return {
            data: PropTypes.array.isRequired,
            locationPath: PropTypes.string.isRequired
        };
    }

    renderLinks() {
        const { data, locationPath } = this.props;
        let linksTemplate = null;
    
        if (data.length) {
            linksTemplate = data.map(function(item) {
                if (item.link === locationPath) item.current = true;
                else item.current = false;
                return <LinkEl key={item.link} data={item}/>;
            });
        } else {
            linksTemplate = <p>Something starnge</p>;
        }
    
        return linksTemplate;
    }
    
    render() {
        const { data } = this.props;

        return (
            <ul className="navbar-nav mr-auto" data={data}>
                {this.renderLinks()}
            </ul>
        );
    }
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.onTest = this.onTest.bind(this);
    }

    onTest(e) {
        e.preventDefault();
        const login = this.props.login;
        console.log(login);
        login('test', 'dfdfdf');
    }

    render() {
        const { user, locationPath } = this.props;
        return (
            <header className="navbar">
                <nav className="navbar navbar-expand-md navbar-light fixed-top bg-light">
                    <Link className="navbar-brand mx-auto ml-md-0 mr-md-3" to="/">
                        <img src="/images/logo.png" height="50" className="d-inline-block align-top" alt=""/>
                        Rapid delivery
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <button role="button" onClick={this.onTest} className="btn btn-primary btn-sm">sfghs</button>
                        <MenuLinks data={links} locationPath={locationPath} />
                        <UserNavBarRight user={user} />
                    </div>
                </nav>
            </header>
        );
    }
}

Header.propTypes = {
    user: PropTypes.object.isRequired,
    locationPath: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired
};

export default Header;