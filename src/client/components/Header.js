import React, { Component } from "react";
import PropTypes from 'prop-types';

const NavBarRightUser = () => {
    return (
        <ul className="navbar-nav navbar-right">
            <div className="container center-block text-center">
                <div className="row">
                    <div className="col d-md-inline-flex">
                        <a role="button" href="/auth/login" className="btn btn-primary btn-sm">Увійти</a>
                        <a role="button" href="/auth/register" className="btn btn-outline-primary ml-3 btn-sm">Зареєструватися</a>
                    </div>
                </div>
            </div>
        </ul>
    );
};

const links = [
    {
        link: "/",
        text: "Головна",
        current: true
    },
    {
        link: "/about",
        text: "Про компанію",
        current: false
    }
];

class Link extends Component {
    render() {
        const { link, text, current } = this.props.data;
        return (
            <li className={"nav-item" + (current ? " active" : "")}>
                <a className="nav-link text-nowrap" href={link}>{text} {current ? <span className="sr-only">(current)</span> : null }</a>
            </li>
        );
    }
}

Link.propTypes = {
    data: PropTypes.shape({
        link: PropTypes.string.isRequired, 
        text: PropTypes.string.isRequired,
        current: PropTypes.bool.isRequired
    })
};

class MenuLinks extends Component {
    static get propTypes() {
        return {
            data: PropTypes.array.isRequired
        };
    }

    renderLinks() {
        const { data } = this.props;
        let linksTemplate = null;
    
        if (data.length) {
            linksTemplate = data.map(function(item) {
                return <Link key={item.link} data={item}/>;
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
  render() {
    return (
        <header className="navbar">
            <nav className="navbar navbar-expand-md navbar-light fixed-top bg-light">
                <a className="navbar-brand mx-auto ml-md-0 mr-md-3" href="/">
                    <img src="/images/logo.png" height="50" className="d-inline-block align-top" alt=""/>
                    Rapid delivery
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <MenuLinks data={links} />
                    <NavBarRightUser />
                </div>
            </nav>
        </header>
    );
  }
}


export default Header;