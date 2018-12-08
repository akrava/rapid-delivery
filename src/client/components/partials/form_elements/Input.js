import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Input extends Component {
    render() {
        const { 
            type, 
            name, 
            label, 
            invalidFeedback, 
            placeholder, 
            helpInfo,
            minLength,
            maxLength,
            pattern,
            required,
            formInline,
            valueOnChage
        } = this.props;
        return (
            <React.Fragment>
                <label htmlFor={`${name}_field`}>{label}:</label>
                <input 
                    type={type} 
                    className={`form-control ${formInline ? "mx-sm-3" : null}`}
                    id={`${name}_field`} 
                    placeholder={placeholder || label}  
                    minLength={minLength || null}  
                    maxLength={maxLength || null} 
                    pattern={pattern || null} 
                    name={name} 
                    onChange={valueOnChage || null}
                    aria-describedby={`${name}_helpBlock`} 
                    required={required}
                />
                {helpInfo && 
                    <small id={`${name}_helpBlock`} className="form-text text-muted">
                        {helpInfo}
                    </small>
                }
                {invalidFeedback &&
                    <div className="invalid-feedback">
                        {invalidFeedback}
                    </div>
                }
            </React.Fragment>
        );
    }
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired, 
    label: PropTypes.string.isRequired, 
    invalidFeedback: PropTypes.string, 
    placeholder: PropTypes.string, 
    helpInfo: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    pattern: PropTypes.string,
    required: PropTypes.bool,
    formInline: PropTypes.bool,
    valueOnChage: PropTypes.func
};

export default Input;