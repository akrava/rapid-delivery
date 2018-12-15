import React, { Component } from 'react';
import ErrorBoundary from './special/ErrorBoundary';
import Header from './partials/header/Header';
import Main from './partials/main/Main';
import Footer from './partials/footer/Footer';

class App extends Component {
    render() {
        return (
            <ErrorBoundary>
                <Header />
                <Main />
                <Footer />
            </ErrorBoundary>
        );
    }
};

export default App;