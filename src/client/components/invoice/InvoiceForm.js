// @ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './../../components/partials/form_elements/Input';
import { Link } from 'react-router-dom';
import { onSubmitFormValidation, onMountedForm } from './../../utils/validtion';
import { isAdmin } from './../../utils/service';
import { toValueHtmlString } from './../../utils/dateConversion';

class InvoiceForm extends Component {
    constructor(props) {
        super(props);
        const invoice = props.invoice;
        this.state = {
            registryNum: invoice ? invoice.registry.number : '',
            recipientLogin: invoice ? invoice.recipient.login : '',
            description: invoice ? invoice.description : '',
            departure: invoice ? invoice.departure : '',
            location: invoice ? invoice.location : '',
            weight: invoice ? invoice.weight : '',
            cost: invoice ? invoice.cost : '',
            textNotValid: 'виберіть одержувача'
        };
        this.invoiceNumber = invoice ? invoice.number : -1;
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.refForm = React.createRef();
        this.labelPhotoInput = React.createRef();
        this.photoInputOnChange = this.photoInputOnChange.bind(this);
        this.handleRegistryChange = this.handleRegistryChange.bind(this);
        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.recipientSelect = React.createRef();
        this.registrySelect = React.createRef();
    }

    componentDidMount() {
        onMountedForm();
    }
    
    photoInputOnChange(e) {
        const fileName = e.currentTarget.value;
        this.labelPhotoInput.current.innerHTML = fileName;
    }

    formOnSubmit(e) { 
        if (onSubmitFormValidation(e) && !this.props.user.isFetching) {
            e.preventDefault();
            const form = this.refForm.current;
            const formData = new FormData(form);
            this.props.formSubmitCallback(this.invoiceNumber, formData);
        }       
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

    getUserByRegistry(registryNum, registriesArr) {
        let userLogin;
        registriesArr.forEach(x => {
            x.value.forEach(y => {
                if (y.selectValue === +registryNum) {
                    userLogin = x.username;
                }
            });
        });
        return userLogin;
    }

    handleRegistryChange(e) {
        if (isAdmin(this.props.user.role) && this.state.recipientLogin) {
            const registry = e.currentTarget.value;
            const curRecipient = this.state.recipientLogin;
            const targetUser = this.getUserByRegistry(registry, this.props.registriesArr);
            if (curRecipient === targetUser) {  
                this.setState({textNotValid: 'отримувач та відпраник не може бути однією особою'});
                this.recipientSelect.current.setCustomValidity('Error');
            } else {  
                this.setState({textNotValid: 'виберіть одержувача'});
                this.recipientSelect.current.setCustomValidity("");
            }
        }
        this.handleFieldChange("registryNum")(e);
    }

    handleRecipientChange(e) {
        if (isAdmin(this.props.user.role) && this.state.registryNum) {
            const recipient = e.currentTarget.value;
            const curRegistryNum = this.state.registryNum;
            const targetUser = this.getUserByRegistry(curRegistryNum, this.props.registriesArr);
            if (recipient === targetUser) {
                this.setState({textNotValid: 'отримувач та відпраник не може бути однією особою'});
                this.recipientSelect.current.setCustomValidity('Error');
            } else {
                this.setState({textNotValid: 'виберіть одержувача'});
                this.recipientSelect.current.setCustomValidity('');
            }
        }
        this.handleFieldChange("recipientLogin")(e);
    }

    renderHeader(invoice) {
        if (invoice) return <h1>Редагування накладної №{invoice.number}</h1>;
        else return <h1>Створення нової накладної</h1>;
    }

    checkAbilityToCreateInvoice(registries, isAdminRights) {
        let count = 0;
        if (isAdminRights) {
            registries.forEach(x => {
                count += x.value.length;
            });
        } else {
            count = registries.length;
        }
        return count > 0;
    }

    render() {
        if (!Array.isArray(this.props.registriesArr) || !this.props.user || !this.props.users) {
            return <h1>Loading...</h1>;
        }
        const invoice = this.props.invoice;
        if (!this.checkAbilityToCreateInvoice(this.props.registriesArr, isAdmin(this.props.user.role))) {
            return (
                <React.Fragment>
                    <h1>Накладна не може бути створена</h1>
                    <p><Link className="link-style" to="/registries/new">Створіть реєстр</Link>, щоби мати можливість створювати ТТН</p>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {this.renderHeader(invoice)}
                <p>
                    Усі поля (окім фото) форми, наведеної нижче, є необхідними для заповнення:<br/>
                    {invoice &&
                        "Якщо ви не бажаєте оновлювати фото, залиште відповідне поле пустим."
                    }
                </p>
                <form id="insert-invoice" className="form-default mx-auto mb-4 p-4 needs-validation" ref={this.refForm} encType="multipart/form-data" onSubmit={this.formOnSubmit} noValidate>
                    <div className="form-group form-inline ">
                        <Input 
                            type={this.props.user && isAdmin(this.props.user.role) ? "select-group" : "select" }
                            name="registryNum"
                            label="Реєстр"
                            invalidFeedback="виберіть реєстр"
                            valueOnChage={this.handleRegistryChange}
                            refAction={this.registrySelect}
                            formInline
                            value={this.state.registryNum}
                            optionNotSelectedText={!invoice && "виберіть реєстр"}
                            options={this.props.registriesArr}
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="select"
                            name="recipientLogin"
                            label="Одержувач"
                            invalidFeedback={this.state.textNotValid}
                            valueOnChage={this.handleRecipientChange}
                            refAction={this.recipientSelect}
                            formInline
                            value={this.state.recipientLogin}
                            optionNotSelectedText={!invoice && "виберіть одержувача"}
                            options={this.props.users} 
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="text"
                            name="description"
                            label="Опис відправлення"
                            pattern="^[^\s]+(\s+[^\s]+)*$"
                            placeholder="Короткий опис"
                            minLength={3}
                            maxLength={100}
                            helpInfo="від 3 до 100 символів (без пробілів на кінцях)"
                            invalidFeedback="Введіть корректний опис посилки"
                            valueOnChage={this.handleFieldChange("description")}
                            formInline
                            value={this.state.description}
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="date"
                            name="departure"
                            label="Дата відправки"
                            invalidFeedback="Введіть дату відправки"
                            valueOnChage={this.handleFieldChange("departure")}
                            value={toValueHtmlString(this.state.departure)}
                            formInline
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="text"
                            name="location"
                            label="Місто відділеня"
                            pattern="^[^\s]+(\s+[^\s]+)*$"
                            minLength={3}
                            maxLength={50}
                            helpInfo="довжина від 3 до 50 символів включно"
                            invalidFeedback="Введіть корректно місто відділення"
                            valueOnChage={this.handleFieldChange("location")}
                            formInline
                            value={this.state.location}
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="number"
                            name="weight"
                            label="Вага, кг"
                            stepVal={0.001}
                            minVal="0.001"
                            pattern="^[1-9][0-9]*$"
                            placeholder="Вага"
                            helpInfo="більше нуля, макс. крок - 0.001"
                            invalidFeedback="Введіть правильну вагу посилки"
                            valueOnChage={this.handleFieldChange("weight")}
                            formInline
                            value={this.state.weight}
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="number"
                            name="cost"
                            label="Оголошена вартість, грн"
                            stepVal={0.01}
                            minVal={"0.01"}
                            placeholder="Оголошена вартість"
                            helpInfo="більше нуля, макс. крок - 0.01"
                            invalidFeedback="Введіть корректну вартість"
                            valueOnChage={this.handleFieldChange("cost")}
                            formInline
                            value={this.state.cost}
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="file"
                            name="photo"
                            label="Фото відправлення"
                            helpInfo="формат .jpg, .png; розмір до 3 МБ"
                            formInline
                            valueOnChage={this.photoInputOnChange}
                            labelRef={this.labelPhotoInput}
                            accept="image/*"
                        />
                    </div>
                    <div className="col d-inline-flex">
                        <button className="btn btn-primary ml-auto mr-4" type="submit" disabled={this.props.isFetching}>{invoice ? "Оновити" : "Додати"}</button>
                        <button className="btn btn-secondary mr-auto" onClick={this.props.goBackCallback}>Відмінити</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

InvoiceForm.propTypes = {
    invoice: PropTypes.object,
    user: PropTypes.object,
    users: PropTypes.array,
    registriesArr: PropTypes.array,
    goBackCallback: PropTypes.func.isRequired,
    formSubmitCallback: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired
};

export default InvoiceForm;