import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Input from '../../components/partials/form_elements/Input';
import { sendNotification }  from './../../actions/notify';

class NotificationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isImportant: false
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    static mapStateToProps(store) {
        return { notify: store.notify };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            sendNotification: (message, isImportant) => dispatch(sendNotification(message, isImportant))
        };
    }

    handleFieldChange(field) {
        const this_obj = this;
        return function(e) {
            const obj = {};
            if (typeof e.currentTarget.value === "undefined") {
                return;
            }
            obj[field] = e.currentTarget.value;
            this_obj.setState(obj);
        };
    }

    sendMessage() {
        if (!this.props.notify.isFetching) {
            this.props.sendNotification(this.state.message, this.state.isImportant);
        }
    }

    render() {
        return (
            <div className="container p-2 my-3 send-message-notify">
                <div className="row px-3">
                    <h4 className="text-center w-100">Відправлення повідомленнь усім користувачам з Телеграмом:</h4>
                </div>
                <div className="row flex-xl-row px-3">
                    <div className="col-xl-6">
                        <Input 
                            type="textarea"
                            name="message"
                            label="Повідомлення"
                            maxLength={1000}
                            placeholder="у форматі Markdown"
                            valueOnChage={this.handleFieldChange("message")}
                            rows={9}
                            value={this.state.message}
                        />
                    </div>
                    <div className="col-xl-6" >
                        <label>Перегляд:</label>
                        <div id="reset-all">
                            <ReactMarkdown
                                source={this.state.message}
                                escapeHtml={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="row px-3 py-3">
                    <div className="ml-auto pr-4" style={{width: "200px"}}>
                        <Input 
                            type="select"
                            name="isImportant"
                            label="Тип сповіщеня"
                            formInline
                            valueOnChage={this.handleFieldChange("isImportant")}
                            options={[{ name: `Звичайне`, selectValue: false}, { name: `Важиливе`, selectValue: true}]}
                            value={this.state.isImportant}
                        />
                    </div>
                    <div className="d-flex">
                        <button onClick={this.sendMessage} disabled={this.state.message.length < 3 || this.state.message.length > 1000 || this.props.notify.isFetching} className="btn btn-primary ml-2 mr-4  mt-auto" type="submit">Відправити</button>
                    </div>
                </div>
            </div>
        );
    }
}


NotificationForm.propTypes = {
    notify: PropTypes.object.isRequired,
    sendNotification: PropTypes.func.isRequired  
};

export default withRouter(connect(NotificationForm.mapStateToProps, NotificationForm.mapDispatchToProps)(NotificationForm));