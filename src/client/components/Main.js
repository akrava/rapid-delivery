import React, { Component } from "react";


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
                        <a className="btn btn-primary btn-lg" href="/auth/register" role="button">Зареєструватися</a>
                        <a className="btn btn-light btn-lg ml-2" href="/auth/login" role="button">Увійти</a>
                    </React.Fragment>
                )}
                {visible && (
                    <React.Fragment>
                        <p className="mb-0">Скористайтесь послугами вже зараз:</p>
                        <a className="btn btn-primary btn-lg mr-2 mt-2" href="/registries/new" role="button">Створити реєстр</a>
                        <a className="btn btn-light btn-lg mt-2" href="/invoices/new" role="button">Створити накладну</a>
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}


class Main extends Component {
  render() {
    return (
        <main className="container mt-4" role="main">
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
                            <b>Rapid delivery</b> онлайн, а саме: дізнаватися дату доставки вантажу, 
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
        </main>
    );
  }
}

export default Main;