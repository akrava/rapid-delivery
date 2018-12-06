import React, { Component } from 'react';
import Jumbotron from './../../containers/index/Jumbotron';

class HomePage extends Component {
    render() {
        return (
            <React.Fragment>
                <Jumbotron />
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