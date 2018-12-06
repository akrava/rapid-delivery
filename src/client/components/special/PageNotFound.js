import React, { Component } from 'react';

class PageNotFound extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="errorPage">
                    <span>Sorry, something went wrong...</span>
                    <img src="/images/crying-cat.png" className="mx-auto"/>
                </div>
                <h1 className="errorPage">404: Page not found</h1>
                <p className="errorPage mb-5">hmmm</p>
            </React.Fragment>
        );
    }
}

export default PageNotFound;
