import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAdmin, isStaffUser } from './../../utils/service';

class JumbotronButtonsBlock extends Component {
    getGreetingTextAndLinks() {
        let role = -1;
        const { isLogined } = this.props.user;
        if (isLogined) {
            if (isAdmin(role)) {
                return {
                    text: 'Контролюйте роботу компанії:',
                    buttons: [
                        { link: '/users', text: 'Користуачі' },
                        { link: '/invoices', text: 'Накладні' }
                    ]
                };
            } else if (isStaffUser(role)) {
                return {
                    text: 'Панель:',
                    buttons: [
                        { link: '/hmmm', text: 'hmmmmm' }
                    ]
                };
            } else {
                return {
                    text: 'Скористайтесь послугами вже зараз:',
                    buttons: [
                        { link: '/registries/new', text: 'Створити реєстр' },
                        { link: '/invoices/new', text: 'Створити накладну' }
                    ]
                };
            }
        } else {
            return {
                text: 'Зареєструйтесь, щоб відкрити для себе світ нових можливостей!',
                buttons: [
                    { link: '/register', text: 'Зареєструватися' },
                    { link: '/login', text: 'Увійти' }
                ]
            };
        }
    }

    Button(buttons) {
        const listButtons = buttons.buttons.map((button, index) =>
            <Link key={index} className={`btn ${index === 0 ? "btn-primary" : "btn-light" } btn-lg mt-2 ${index === 0 && "mr-2"}`} to={button.link} role="button">{button.text}</Link>
        );
        return (listButtons);
    }

    render() {
        const { text, buttons } = this.getGreetingTextAndLinks();
        return (
            <React.Fragment>
                <p className="mb-0">{text}</p>
                <this.Button buttons={buttons} />
            </React.Fragment>
        );
    }
}

JumbotronButtonsBlock.propTypes = {
    user: PropTypes.shape({
        isLogined: PropTypes.bool.isRequired,
        userObject: PropTypes.object
    })
};

export default JumbotronButtonsBlock;