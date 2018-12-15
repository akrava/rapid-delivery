import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './../../components/partials/form_elements/Input';
import { onSubmitFormValidation, onMountedForm } from './../../utils/validtion';
import { isAdmin } from './../../utils/service';

class RegistryForm extends Component {
    constructor(props) {
        super(props);
        const registry = props.registry;
        this.state = {
            name: registry ? registry.name : '',
            description: registry ? registry.description : '',
            userLogin: registry ? registry.user.login : ''
        };
        this.registryNumber = registry ? registry.number : -1;
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.refForm = React.createRef();
    }

    componentDidMount() {
        onMountedForm();
    }

    formOnSubmit(e) { 
        if (onSubmitFormValidation(e) && !this.props.user.isFetching) {
            e.preventDefault();
            const form = this.refForm.current;
            const formData = new FormData(form);
            this.props.formSubmitCallback(this.registryNumber, formData);
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

    renderHeader(registry) {
        if (registry) return <h1>Редагування реєстру {registry.number} - {registry.name}</h1>;
        else return <h1>Створення нового реєстру накладних</h1>;
    }

    render() {
        const registry = this.props.registry;
        return (
            <React.Fragment>
                {this.renderHeader(registry)}
                <p>
                    Усі поля форми, наведеної нижче, є необхідними для заповнення:<br/>
                </p>
                <form id="insert" className="needs-validation mx-auto form-default mb-4 p-4" ref={this.refForm} onSubmit={this.formOnSubmit} noValidate>
                    <div className="form-group form-inline ">
                        {isAdmin(this.props.user.role) 
                        ?
                        <Input 
                            type="select"
                            name="userLogin"
                            label="Користувач"
                            invalidFeedback="Виберіть користувача"
                            valueOnChage={this.handleFieldChange("userLogin")}
                            formInline
                            value={this.state.userLogin}
                            optionNotSelectedText={!registry && "виберіть користувача"}
                            options={this.props.users}
                            required
                        />
                        : 
                        !registry && <input type="hidden" name="userLogin" value={this.props.user.login}></input>
                        }
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="text"
                            name="name"
                            label="Назва"
                            pattern="^[^\s]+(\s+[^\s]+)*$"
                            minLength={3}
                            maxLength={50}
                            helpInfo="довжина від 3 до 50 символів (без пробілів на кінцях)"
                            invalidFeedback="Введіть правильну назву"
                            valueOnChage={this.handleFieldChange("name")}
                            formInline
                            value={this.state.name}
                            required
                        />
                    </div>
                    <div className="form-group form-inline ">
                        <Input 
                            type="text"
                            name="description"
                            label="Короткий опис"
                            pattern="^[^\s]+(\s+[^\s]+)*$"
                            minLength={3}
                            maxLength={100}
                            helpInfo="довжина від 3 до 100 символів (без пробілів на кінцях)"
                            invalidFeedback="Введіть корректний опис"
                            valueOnChage={this.handleFieldChange("description")}
                            formInline
                            value={this.state.description}
                            required
                        />
                    </div>
                    <div className="col d-inline-flex">
                        <button className="btn btn-primary ml-auto mr-4" type="submit" disabled={this.props.isFetching}>{registry ? "Оновити" : "Додати"}</button>
                        <button className="btn btn-secondary mr-auto" onClick={this.props.goBackCallback}>Відмінити</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

RegistryForm.propTypes = {
    registry: PropTypes.object,
    users: PropTypes.array,
    user: PropTypes.object,
    goBackCallback: PropTypes.func.isRequired,
    formSubmitCallback: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired
};

export default RegistryForm;