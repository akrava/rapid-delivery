import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ResourceCard extends Component {
    getHtml(value) {
        return {__html: value};
    }

    render() {
        return (
            <table className="mx-auto styled captioned api-table table-responsive mb-3">
                <caption>{this.props.title}</caption>
                <tbody>
                    <tr>
                        <td>URL</td>
                        <td>/api/v1{this.props.url}</td>
                    </tr>
                    <tr>
                        <td>Method</td>
                        <td>{this.props.method}</td>
                    </tr>
                    <tr>
                        <td>Authentication</td>
                        <td dangerouslySetInnerHTML={{__html: this.props.auth}}></td>
                    </tr>
                    <tr>
                        <td>URL Params</td>
                        <td dangerouslySetInnerHTML={{__html: this.props.params}}></td>
                    </tr>
                    <tr>
                        <td>Data Params</td>
                        <td dangerouslySetInnerHTML={{__html: this.props.data}}></td>
                    </tr>
                    <tr>
                        <td>Success Response</td>
                        <td dangerouslySetInnerHTML={{__html: this.props.success}}></td>
                    </tr>
                    <tr>
                        <td>Error Response</td>
                        <td dangerouslySetInnerHTML={{__html: this.props.error}}></td>
                    </tr>
                </tbody>
            </table> 
        );
    }
}

ResourceCard.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    auth: PropTypes.string.isRequired,
    params: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired
};

export default ResourceCard;