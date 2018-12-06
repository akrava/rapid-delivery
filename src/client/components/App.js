import React, { Component } from 'react';
import Header from './partials/header/Header';
import Main from './partials/main/Main';
import Footer from './partials/footer/Footer';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Header />
                <Main />
                <Footer />
            </React.Fragment>
        );
    }
};

export default App;