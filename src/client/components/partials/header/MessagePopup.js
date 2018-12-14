import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { typesMessages } from './../../../actions/showMessage';

class MessagePopup extends Component {
    constructor(props) {
        super(props);
        this.getIcon = this.getIcon.bind(this);
    }

    IconDanger() {
        return <span><i className="fas fa-exclamation-triangle mr-1"></i></span> ;
    }

    IconSuccess() {
        return <span><i className="far fa-check-circle mr-1"></i></span> ;
    }

    IconInfo() {
        return <span><i className="fas fa-info-circle"></i></span>;
    }

    getIcon(type) {
        switch(type) {
            case typesMessages.error:   return <this.IconDanger />; 
            case typesMessages.success: return <this.IconSuccess />; 
            case typesMessages.info:    return <this.IconInfo />;  
        }
    }

    render() {
        let type_text;
        switch (this.props.systemMessages.type) {
            case typesMessages.info:    type_text = "primary"; break;
            case typesMessages.success: type_text = "success"; break;
            case typesMessages.error:   type_text = "danger";  break;
        }

        return (
            <div className={`popup-animation ${this.props.systemMessages.isViewing ? "active" : "hidden"}`}> 
                <div className={"system-notify alert alert-" + type_text + " alert-dismissible fade show w-90 w-lg-40 mt-2 mx-auto text-center"} role="alert">
                    <span> {this.getIcon(this.props.systemMessages.type) } </span>
                    {this.props.systemMessages.text}
                </div>
            </div>
        );
    }
}

MessagePopup.propTypes = {
    systemMessages: PropTypes.shape({
        text: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        isViewing: PropTypes.bool.isRequired
    })
};

export default MessagePopup;