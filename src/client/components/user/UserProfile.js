import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isAdmin, isStaffUser } from './../../utils/service';
import { toFormatedString } from './../../utils/dateConversion';
import ModalDialog from './../../components/partials/modals/ModalDialog';


class UserProfile extends Component {
    viewIcon(role) {
        if (isAdmin(role)) {
            return <span className="def"><i className="far fa-star ml-3"></i></span>;
        } else if (isStaffUser(role)) {
            return <span className="def"><i className="fas fa-user-cog ml-3"></i></span>;
        }
        return false;
    }

    registriesList(registries) {
        if (!registries) return false;
        return registries.map(registry => {
            return <li key={registry.number}><Link className="link-style" to={`/registries/${registry.number}`}>{registry.number} - {registry.name}</Link> ({registry.invoices.length})</li>;
        });
    }

    upcomingInvoicesList(upcomingInvoices) {
        if (!upcomingInvoices) return false;
        return upcomingInvoices.map(invoice => {
            return <li key={invoice.number}><Link className="link-style" to={`/invoices/${invoice.number}`}>{invoice.number}</Link></li>;
        });
    }

    editAction() {
        return (
            <form className="mx-auto form-inline py-2 update-btn">
                <Link className="mx-auto" to="/users/me/edit"><button className="btn btn-primary btn-sm mx-auto">Редагувати акаунт</button></Link>
            </form>
        );
    }

    changeRole(user) { console.log("hoba", user.role, "sfdsdf");
        return (
            <form className="mx-auto change-role" onSubmit={this.props.functionCallback} action="/users/changeRole" method="POST">
                <input name="username" type="hidden" value={user.login} />
                <div className="form-row py-2">
                    <div className="form-inline mb-1 mx-auto">
                        <select name="role" defaultValue={user.role} className="custom-select custom-select-sm mr-sm-3 mr-0 text-center" required>
                            <option value="0">Звичайний користувач</option>
                            <option value="2">Сортувальник</option>
                            <option value="3">Адмін</option>
                        </select>
                        <button className="btn btn-primary btn-sm mx-auto mt-sm-0 mt-2" data-toggle="modal" data-target="#changeRoleModal" type="button">Зберегти</button>
                    </div>
                </div>
                <ModalDialog titleModal="Збереження змін" actionModal="Змінити" textModal="Ви впевнені, що хочете змінити роль?" />
            </form>
        );
    }
    
    render() {
        const user = this.props.user;
        return (
            <React.Fragment>
                <div className="user-info text-center">
                    <img src={user.avaUrl} alt="user photo"/>
                    <h1 className="mb-4">{user.fullname}{this.viewIcon(user.role)}</h1>
                    <p><Link to="#" className="link-style">{user.login}</Link> <span>{toFormatedString(user.registered)}</span></p>
                    <p>Телефон: <b>{user.phone}</b>, email: <b>{user.email}</b></p>
                    <div>
                        {user.bio ? user.bio : <i>Біографія поки що не заповнена</i>}
                    </div>
                </div>
                <div className="content-bottom my-3">
                    <p>{user.fullname} створив(-ла) <b>{user.totalInvoices}</b> накладних у <b>{user.registries.length}</b> реєстрах.</p> 
                    {user.registries.length > 0 
                        ? <p>Список з <b>{user.registries.length}</b> реєстрів користувача. <i>(у дужках зазначено к-сть ТТН)</i></p>
                        : <p>Цей користувач ще не створив реєстрів.</p>
                    }
                    <ul className="list-inline">
                        {this.registriesList(user.registries)}
                    </ul>
                    {user.upcomingInvoices.length > 0 
                        ? <p>Усього <b>{user.upcomingInvoices.length}</b> накладних, які були відправлені цьому користувачу:</p>
                        : <p>Цьому користувачу ще нічого не відправили.</p>
                    }
                    <ul className="list-inline">
                        {this.upcomingInvoicesList(user.upcomingInvoices)}
                    </ul>
                </div>
                <p className="text-center">Дії з акаунтом:</p>
                <div className="actions default-form mb-4">
                   { this.props.isMyProfile ? this.editAction() : this.changeRole(this.props.user) }
                </div>
            </React.Fragment>
        );
    }
}

UserProfile.propTypes = {
    user: PropTypes.object.isRequired,
    isMyProfile: PropTypes.bool.isRequired,
    functionCallback: PropTypes.func
};

export default UserProfile;