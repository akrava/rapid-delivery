import React, { Component } from 'react';

class Forbidden extends Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="errorPage">403: Forbidden</h1>
                <p className="errorPage mb-5">У вас не вистачає прав, шоб переглядати цей матеріалл</p>
            </React.Fragment>
        );
    }
}

export default Forbidden;