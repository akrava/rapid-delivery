import React, { Component } from 'react';
import UsersTable from './../../containers/users/UsersTable';

class UsersPage extends Component {
    render() {
        return (
            <React.Fragment>
                <h1>Cписок користувачів</h1>
                <p>Нижче в <i>таблиці</i> наведені всі користувачі даного онлайн-сервісу.</p>
                <p>Також можна переглянути персональну сторінку кожного з користувачів.</p>
                <UsersTable />
                <p>
                    Кожна сторінка користувача містить в собі інформацію про нього. Таким чином
                    можна побачити фотокартку, повне ім&#39;я, дату реєстрації та біографію кожного 
                    учасника.
                </p>
            </React.Fragment>
        );
    }
}

export default UsersPage;