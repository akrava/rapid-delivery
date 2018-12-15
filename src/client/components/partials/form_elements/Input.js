import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Input extends Component {
    constructor(props) {
        super(props);
        this.renderInput = this.renderInput.bind(this);
    }

    fileInput(props) {
        return (
            <div className="custom-file">
                <input type="file" style={{width: "257px"}} onChange={props.valueOnChage} className="custom-file-input" accept={props.accept} name={props.name} id={`${props.name}_field`} required={props.required}/>
                <label ref={props.labelRef} className={`custom-file-label small ${props.formInline ? "mx-sm-3" : null}`} id="file-label" style={{justifyContent: "left"}} htmlFor="customFile">Виберіть фото</label>
            </div>
        );
    }

    textareaInput(props) {
        return (
            <textarea value={props.value || ''} placeholder={props.placeholder} className={`form-control ${props.formInline ? "mx-sm-3" : null}`} name={props.name}  id={`${props.name}_field`}  rows={props.rows} onChange={props.valueOnChage || null}  maxLength={props.maxLength} />
        );
    }

    selectInput(props) {
        return (
            <select name={props.name} ref={props.refAction || null} onChange={props.valueOnChage} defaultValue={props.value || "default-type"} className="form-control mx-sm-3 custom-select" id={`${props.name}_field`} required>
                {props.optionNotSelectedText && <option hidden disabled value="default-type">{props.optionNotSelectedText}</option>}
                {props.options && props.options.map(option => {
                    return <option key={option.selectValue} value={option.selectValue}>{option.name}</option>;
                })}
            </select>
        );
    }

    selectInputGroup(props) {
        return (
            <select name={props.name} ref={props.refAction || null} onChange={props.valueOnChage} defaultValue={props.value || "default-type"} className="form-control mx-sm-3 custom-select" id={`${props.name}_field`} required>
                {props.optionNotSelectedText && <option hidden disabled value="default-type">{props.optionNotSelectedText}</option>}
                {props.options && props.options.map((option, index) => {
                    return (
                        <optgroup key={index} label={option.label}>
                        {option.value.map(val => {
                            return <option key={val.selectValue} value={val.selectValue}>{val.name}</option>;
                        })}                       
                        </optgroup>
                    );
                })}
            </select>
        );
    }

    renderInput(type, props) {
        switch(type) {
            case 'textarea': {
                return this.textareaInput(props);
            }
            case 'file': {
                return this.fileInput(props);
            }
            case 'select': {
                return this.selectInput(props);
            }
            case 'select-group': {
                return this.selectInputGroup(props);
            }
            default: {
                return this.defaultInput(props);
            }
        }
    }

    defaultInput(props) {
        return (
            <input 
                type={props.type} 
                className={`form-control ${props.formInline ? "mx-sm-3" : null}`}
                id={`${props.name}_field`} 
                placeholder={props.placeholder || props.label}  
                minLength={props.minLength || null}  
                maxLength={props.maxLength || null} 
                pattern={props.pattern || null} 
                name={props.name} 
                onChange={props.valueOnChage || null}
                onClick={props.valueOnClick || null}
                onFocus={props.valueOnFocus || null}
                ref={props.refAction || null}
                aria-describedby={`${props.name}_helpBlock`}
                value={props.value}
                step={props.stepVal || null}
                min={props.minVal || null}
                required={props.required}
            />
        );
    }

    render() {
        const { 
            type, 
            name,
            label, 
            invalidFeedback, 
            helpInfo
        } = this.props;
        return (
            <React.Fragment>
                <label htmlFor={`${name}_field`}>{label}:</label>
                {this.renderInput(type, this.props)}
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
    valueOnChage: PropTypes.func,
    valueOnClick: PropTypes.func,
    valueOnFocus: PropTypes.func,
    refAction: PropTypes.object,
    value: PropTypes.any,
    accept: PropTypes.string,
    rows: PropTypes.number,
    stepVal: PropTypes.number,
    minVal: PropTypes.any
};

export default Input;