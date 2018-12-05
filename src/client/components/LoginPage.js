import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoginPage extends Component {
    onTest(e) {
        e.preventDefault();
        const login = this.props.route.login;
        console.log(login);
        login('test', 'dfdfdf');
    }

    render() {
        // let breadcrumb, error, inform;
        return (
            <React.Fragment>
                <nav aria-label="breadcrumb">
                    {/* {breadcrumb} */}
                </nav>
                <h1>Вхід</h1>
                <p>
                    Якщо у вас ще немає облікового запису, зареєструйтесь, будь ласка, на сторінці <a href="/auth/register" className="link-style">реєстрації</a>.
                </p>
                {/* {error} */}
                <div className="alert alert-danger alert-dismissible fade show w-100 w-lg-40  mx-auto text-center" role="alert">
                    <i className="fas fa-exclamation-triangle mr-1"></i>{/* {error} */}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {/* {error}
                {inform} */}
                <div className="alert alert-success alert-dismissible fade show w-100 w-lg-40  mx-auto text-center" role="alert">
                    <i className="far fa-check-circle mr-1"></i>{/* {inform} */}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {/* {inform} */}
                <form id="login" className="needs-validation mx-auto form-default mb-4 p-4"  action="/auth/login" method="POST" noValidate>
                    <div className="form-row">
                        <div className="col-md-6 mb-1 form-group">
                            <label htmlFor="login_field">Логін:</label>
                            <input type="text" className="form-control" id="login_field" placeholder="Логін"  minLength="5" maxLength="20" pattern="[A-Za-z_0-9]{5,20}" name="login" aria-describedby="_helpBlock" required />
                            <div className="invalid-feedback">
                                Введіть правильний логін
                            </div>
                        </div>
                        <div className="col-md-6 mb-1 form-group">
                            <label htmlFor="password_field">Пароль:</label>
                            <input type="password" className="form-control" id="password_field" placeholder="Пароль" minLength="8" maxLength="30" name="password" aria-describedby="_helpBlock" required />
                            <div className="invalid-feedback">
                                Введіть правильний пароль
                            </div>
                        </div>
                        <small id="_helpBlock" className="form-text text-muted ml-1 mb-3">
                            Пароль повинен бути довжиною від 8 до 30 символів.<br/>
                            Логін, довжиною від 5 до 20 символів, складається з A-Z, a-z, 0-9 та _
                        </small>
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary ml-auto mr-0" onClick={this.onTest} type="submit">Увійти</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

LoginPage.propTypes = {
    route: PropTypes.shape({
        login: PropTypes.func.isRequired
    })
};


export default LoginPage;