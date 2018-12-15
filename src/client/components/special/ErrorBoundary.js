import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }
    
    render() {
        if (this.state.errorInfo) {
            return (
                <div>
                    <div className="errorPage">
                        <span>Sorry, something went wrong...</span>
                        <img src="/images/crying-cat.png" className="mx-auto"/>
                    </div>
                    <h1 className="errorPage">500 Internal Server Error</h1>
                    <h2>{this.state.error && this.state.error.toString()}</h2>
                    <details className="errorPage mb-5" style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.any
};

export default ErrorBoundary;