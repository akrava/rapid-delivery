import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PageNotFound extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="errorPage">
                    <span>Sorry, something went wrong...</span>
                    <img src="/images/crying-cat.png" height={266} className="mx-auto"/>
                </div>
                <h1 className="errorPage">404: Page not found</h1>
                <p className="errorPage mb-5">Перейдіть на <Link to="/" className="link-style">головну</Link> сторінку</p>
            </React.Fragment>
        );
    }
}

export default PageNotFound;
