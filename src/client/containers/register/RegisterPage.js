import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Input from './../../components/partials/form_elements/Input';
import { register, checkUsername } from '../../actions/user';
import { onSubmitFormValidation, onMountedForm } from './../../utils/validtion';

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            email: '',
            phone: '',
            login: '',
            pasw: '',
            confirm_pasw: '',
            loginErrorMessage: 'Введіть правильний логін'
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.confirmPaswInput = this.confirmPaswInput.bind(this);
        this.paswInput =  this.paswInput.bind(this);
        this.loginInput =  this.loginInput.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.refLoginInput = React.createRef();
    }

    static mapStateToProps(store) {
        return { user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            registerUser: (formData) => dispatch(register(formData)),
            checkUsername: (username) => dispatch(checkUsername(username))
        };
    }
    
    UNSAFE_componentWillReceiveProps(nextProps) {
        const node = this.refLoginInput.current;
        if (nextProps.user.registration.username.error){
            this.setState({loginErrorMessage: 'Цей логін зайнятий. Виберіть інший'});
            node.setCustomValidity('sdf');
        } else {
            this.setState({loginErrorMessage: 'Введіть правильний логін'});
            node.setCustomValidity('');
        }
    }

    showMessage() {
        const user = this.props.user;
        if (!user.isFetching && !((user.error && user.error.message) 
            || (user.success && user.success.message))) {
            return false;
        }
        const type_text = user.isFetching ? "primary" : user.error ? "danger" : "success";
        const message = user.isFetching ? "Обробка" : user.error ? user.error.message : user.success.message;
        return (
            <div className={"alert alert-" + type_text + " alert-dismissible fade show w-100 w-lg-40  mx-auto text-center"} role="alert">
                <span className={(user.error.message || user.success.message)  && "d-none"}><span className="fas fa-spinner mr-1"></span></span>
                <span className={(user.success.message ||  user.isFetching) && "d-none"}><span className="fas fa-exclamation-triangle mr-1"></span></span>
                <span className={(user.error.message || user.isFetching) && "d-none"}><span className="far fa-check-circle mr-1"></span></span>
                {message}
            </div>
        );
    }

    componentDidMount() {
        onMountedForm();
    }

    formOnSubmit(e) {
        if (onSubmitFormValidation(e)) {
            e.preventDefault();
            const form = document.getElementById("register");
            const formData = new FormData(form);
            this.props.registerUser(formData);
        }       
    }

    loginInput(e){
        this.setState({login: e.currentTarget.value});
        if (e.currentTarget.value && /[A-Za-z_0-9]{5,20}$/.test(e.currentTarget.value) && !this.props.user.registration.username.isFetching) {
            this.props.checkUsername(e.currentTarget.value);
        }
    }

    phoneInputOnFocus(e) {
        if (!e.currentTarget.value) {
            e.currentTarget.value = '+380';
        }
    }

    confirmPaswInput(e) {
        this.setState({confirm_pasw: e.currentTarget.value});
        if (this.state.pasw !== e.currentTarget.value) {
            e.currentTarget.setCustomValidity("Passwords don't match");
        } else {
            e.currentTarget.setCustomValidity('');
        }
    }

    paswInput(e) {
        this.setState({ pasw: e.currentTarget.value });
        if (this.state.confirm_pasw !== '') {
            const pasw_confirm_input = document.getElementById("confirm_pasw_field");
            if (this.state.confirm_pasw !== e.currentTarget.value) {
                pasw_confirm_input.setCustomValidity("Passwords don't match");
            } else {
                pasw_confirm_input.setCustomValidity('');
            };
        }
    }

    handleFieldChange(field) {
        const this_obj = this;
        return function(e) {
            const obj = {};
            obj[field] = e.currentTarget.value;
            this_obj.setState(obj);
        };  
    }

    render() {
        return (
            <React.Fragment>
                <h1>Реєстрація нового користувача</h1>
                <p>
                    Якщо у вас вже є обліковий запис, увійдіть, будь ласка, на сторінці <Link to="/login" className="link-style">входу</Link>.
                </p>
                <p>
                    Усі поля форми, наведеної нижче, є необхідними для заповнення:
                </p>
                <form id="register" className="needs-validation mx-auto form-default mb-4 p-4" onSubmit={this.formOnSubmit} noValidate>
                    <div className="form-group form-inline ">
                        <Input 
                            type="text"
                            name="fullname"
                            label="Повне ім'я"
                            minLength={3}
                            maxLength={30}
                            invalidFeedback="Введіть правильне ім'я"
                            helpInfo="Ім'я повинно мати довжину від 3 до 30 символів включно"
                            valueOnChage={this.handleFieldChange("fullname")}
                            formInline
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="email"
                            name="email"
                            label="E-Mail"
                            placeholder="Введіть email"
                            invalidFeedback="Введіть правильний email"
                            valueOnChage={this.handleFieldChange("email")}
                            formInline
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="tel"
                            name="phone"
                            label="Номер телефону"
                            helpInfo="Формат +380ххххххххх"
                            invalidFeedback="Введіть правильний номер телефону"
                            pattern="\+380[0-9]{9}"
                            valueOnChage={this.handleFieldChange("phone")}
                            valueOnFocus={this.phoneInputOnFocus}
                            formInline
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="text"
                            name="login"
                            label="Логін"
                            minLength={5}
                            maxLength={20}
                            helpInfo="від 5 до 20 символів, складається з A-Z, a-z, 0-9 та _"
                            invalidFeedback={this.state.loginErrorMessage}
                            pattern="[A-Za-z_0-9]{5,20}"
                            valueOnChage={this.loginInput}
                            formInline
                            refAction={this.refLoginInput}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="col-md-6 mb-1 form-group">
                            <Input 
                                type="password"
                                name="pasw"
                                label="Пароль"
                                minLength={8}
                                maxLength={30}
                                invalidFeedback="Введіть правильний пароль"
                                valueOnChage={this.paswInput}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-1 form-group">
                            <Input 
                                type="password"
                                name="confirm_pasw"
                                label="Підтвердження паролю"
                                placeholder="Введіть той самий пароль"
                                minLength={8}
                                maxLength={30}
                                invalidFeedback="Пароль не співпадає"
                                valueOnChage={this.confirmPaswInput}
                                required
                            />
                        </div>
                        <small id="pasw_helpBlock" className="form-text text-muted ml-1 mb-3">
                            Пароль повинен бути довжиною від 8 до 30 символів
                        </small>
                    </div>
                    <div className="col d-md-inline-flex">
                        <button className="btn btn-primary ml-auto mr-4" type="submit">Зареєструватися</button>
                        <button className="btn btn-secondary mr-auto" type="reset">Скинути</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

RegisterPage.propTypes = {
    user: PropTypes.object.isRequired,
    registerUser: PropTypes.func.isRequired,
    checkUsername: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(connect(RegisterPage.mapStateToProps, RegisterPage.mapDispatchToProps)(RegisterPage));