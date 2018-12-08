import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Input from './../../components/partials/form_elements/Input';
import { authenticate } from '../../actions/user';
import { onSubmitFormValidation, onMountedForm } from './../../utils/validtion';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
    }

    static mapStateToProps(store) {
        return { user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { login: (username, password) => dispatch(authenticate(username, password)) };
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
            this.props.login(this.state.username, this.state.password);
            e.preventDefault();
        }       
    }

    handleUsernameChange(e) { 
        this.setState({ username: e.currentTarget.value });
    }

    handlePasswordChange(e) { 
        this.setState({ password: e.currentTarget.value });
    }

    render() {
        return (
            <React.Fragment>
                <h1>Вхід</h1>
                <p>
                    Якщо у вас ще немає облікового запису, зареєструйтесь, будь ласка, на сторінці <Link to="/register" className="link-style">реєстрації</Link>.
                </p>
                {this.showMessage()}
                <form id="login" className="needs-validation mx-auto form-default mb-4 p-4" action="/auth/login" method="POST" onSubmit={this.formOnSubmit} noValidate>
                    <div className="form-row">
                        <div className="col-md-6 mb-1 form-group">
                            <Input 
                                type="text"
                                name="login"
                                label="Логін"
                                minLength={5}
                                maxLength={20}
                                pattern="[A-Za-z_0-9]{5,20}"
                                invalidFeedback="Введіть правильний логін"
                                valueOnChage={this.handleUsernameChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-1 form-group">
                            <Input 
                                type="password"
                                name="password"
                                label="Пароль"
                                minLength={8}
                                maxLength={30}
                                invalidFeedback="Введіть правильний пароль"
                                valueOnChage={this.handlePasswordChange}
                                required
                            />
                        </div>
                        <small id="_helpBlock" className="form-text text-muted ml-1 mb-3">
                            Пароль повинен бути довжиною від 8 до 30 символів.<br/>
                            Логін, довжиною від 5 до 20 символів, складається з A-Z, a-z, 0-9 та _
                        </small>
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary ml-auto mr-0" type="submit">Увійти</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

LoginPage.propTypes = {
    user: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(connect(LoginPage.mapStateToProps, LoginPage.mapDispatchToProps)(LoginPage));