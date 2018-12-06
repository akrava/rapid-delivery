import React, { Component } from "react";
import { Link } from 'react-router-dom';
import NavBar from "./../../../containers/partials/header/NavBar";

class Header extends Component {
    render() {
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
                    <NavBar />
                </nav>
            </header>
        );
    }
}

export default Header;