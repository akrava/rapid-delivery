import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class JumbotronButtonsBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: false
        };

        // This binding is necessary to make `this` work in the callback
        this.handleTest = this.handleTest.bind(this);
    }

    handleTest(e) { // добавили метод
        e.preventDefault();
        this.setState({ admin: true });
    }

    render() {
        const visible = !!this.state.admin;
        return (
            <React.Fragment>
                {!this.state.admin && (
                    <React.Fragment>
                        <p onClick={this.handleTest}>Зареєструйтесь, щоб відкрити для себе світ нових можливостей!</p>
                        <Link className="btn btn-primary btn-lg" to="/register" role="button">Зареєструватися</Link>
                        <Link className="btn btn-light btn-lg ml-2" to="/login" role="button">Увійти</Link>
                    </React.Fragment>
                )}
                {visible && (
                    <React.Fragment>
                        <p className="mb-0">Скористайтесь послугами вже зараз:</p>
                        <Link className="btn btn-primary btn-lg mr-2 mt-2" to="/registries/new" role="button">Створити реєстр</Link>
                        <Link className="btn btn-light btn-lg mt-2" to="/invoices/new" role="button">Створити накладну</Link>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

class HomePage extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="jumbotron">
                    <div className="row">
                        <div className="col-4 my-auto text-center d-none d-xl-block d-lg-block">
                            <img className="img-fluid w-100 logo-img" src="/images/logo.png" alt="Rapid Delivery logo" width="192"/>
                        </div>
                        <div className="col">
                            <h1 className="display-4">Rapid delivery</h1>
                            <h3>Онлайн-сервіс логістичної компанії</h3>
                            <p className="lead">
                                Даний сайт надає можливість користуватися послугами логістичної компанії 
                                <b> Rapid delivery</b> онлайн, а саме: дізнаватися дату доставки вантажу, 
                                реєструвати нову накладну, розрахувати вартість доставки та <i>багато чого іншого.</i>
                            </p>
                            <hr className="my-4"/>
                            <JumbotronButtonsBlock />                    
                        </div>
                    </div>
                </div>
                <img className="float-left mr-2 mb-2" id="landing-home" src="/images/common.jpg" alt="warehouse"/>
                <p className="mb-1">Також нашим користувачам доступні деякі додаткові функції:</p>
                <div className="d-flex">    
                    <ul id="feature-list">
                        <li>генерація pdf файлів:</li>
                            <ul>
                                <li>товарно-транспортної накладної</li>
                                <li>штрих-коду ТТН</li>
                                </ul>
                        <li>генерація звітів за обраний період:</li>
                            <ul>
                                <li>у форматі xls</li>
                                <li>у форматі csv</li>
                            </ul>
                        <li>сповіщення про доставку/отримання вантажу</li>
                        <li>json API </li>
                    </ul> 
                </div>
                <p>
                    Компанія <b>&quot;Rapid delivery&quot;</b> – лідер на ринку експрес-доставок, 
                    надає послуги швидкої, зручної та надійної доставки документів, посилок 
                    та вантажів в <u>будь-яку точку країни</u>.
                </p>
                <p>
                    <strong>Надійність</strong><br/>
                    Сучасні методи сортування вантажів гарантують їх збереження, а також своєчасну і 
                    точну доставку.
                </p>
                <p>    
                    <strong>Швидкість</strong><br/>
                    Унікальна схема організації внутрішньої логістики, сучасний парк вантажних 
                    автомобілів та широка мережа відділень гарантує Клієнтам максимально швидку 
                    доставку вантажу.
                </p>
            </React.Fragment>
        );
    }
}

export default HomePage;