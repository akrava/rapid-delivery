import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Forbidden extends Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="errorPage">401: Unauthorized</h1>
                <p className="errorPage mb-5"><Link to="/login" className="link-style">Увійдіть</Link> в ситему, щоб переглянути цей матеріал.</p>
            </React.Fragment>
        );
    }
}

export default Forbidden;