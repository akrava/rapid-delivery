import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';;
import { isAdmin } from './../../utils/service';
import Forbidden from './../../components/special/Forbidden';
import { toFormatedString } from './../../utils/dateConversion';
import ModalDialog from './../../components/partials/modals/ModalDialog';
import { getRegistryByNum, deleteRegistryByNum } from './../../actions/registry';


class RegistryPage extends Component {
    constructor(props) {
        super(props);
        const num = props.match.params.number;
        this.registryNum = num;
        this.props.getRegistryByNum(num);
        this.onDeleteRegistry = this.onDeleteRegistry.bind(this);
    }

    static mapStateToProps(store) {
        return { registry: store.registry, user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            getRegistryByNum: (number) => dispatch(getRegistryByNum(number)),
            deleteRegistryByNum: (number) => dispatch(deleteRegistryByNum(number))
        };
    }

    willShowForUser(user, registry) {
        if (user.login === registry.user.login || isAdmin(user.role)) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        if (!this.props.registry.isFetching) {
            this.props.getRegistryByNum(this.registryNum);
        }
    }

    onDeleteRegistry(e) {
        e.preventDefault();
        this.props.deleteRegistryByNum(this.registryNum);
    }

    invoicesList(invoices) {
        return invoices.map(invoice => {
            return <li key={invoice}><Link className="link-style" to={`/invoices/${invoice}`}>{invoice}</Link></li>;
        });
    }
    
    render() {
        let registry = this.props.registry.registryObject;
        const user = this.props.user.userObject;
        if (!registry || !registry.data || !user) return <h1>Loading...</h1>;
        registry = registry.data;
        if (!this.willShowForUser(user, registry)) {
            return <Forbidden />;
        }
        return (
            <React.Fragment>
            <h1>Реєстр {registry.number} - {registry.name}</h1>
            <div className="table-responsive p-3">
                <table className="mx-auto styled captioned py-2" id="registry">
                    <caption>Реєстр #{registry.number}</caption>
                    <tbody>
                        <tr>
                            <td>Номер реєстру</td>
                            <td>{registry.number}</td>
                        </tr>
                            <tr>
                            <td>Назва реєстру</td>
                            <td>{registry.name}</td>
                        </tr>
                        {isAdmin(user.role) &&
                            <tr>
                                <td>Автор</td>
                                <td><Link className="link-style ava" to={`/users/${registry.user.login}`}><img src={registry.user.avaUrl} height="30" width="30" className="ava small mr-1" />{registry.user.fullname}</Link></td>
                            </tr>
                        }
                        <tr>
                            <td>Опис</td>
                            <td>{registry.description}</td>
                        </tr> 
                        <tr>
                            <td>Дата створення</td>
                            <td>{toFormatedString(registry.created)}</td>
                        </tr>
                        <tr>
                            <td>Кількість накладних:</td>
                            <td>{registry.invoices.length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="content-bottom registry">
                {registry.invoices.length > 0 
                    ? <p> Усього знайдено <b>{registry.invoices.length}</b> накладних, які знаходяться в цьому реєстрі:</p>
                    : <p>В цьому реєстрі ще немає жодної накладної.</p>
                }
                <ul className="list-inline">
                    {this.invoicesList(registry.invoices)}
                </ul>
            </div>
            <p className="text-center mt-3">Дії з реєстром:</p>
            <div className="actions default-form mb-3">    
                <form className="mx-auto form-inline pt-3 update-btn" action="/registries/edit" method="POST">
                    <Link className="mx-auto" to={`/registries/${registry.number}/edit`}><button className="btn btn-primary btn-sm mx-auto">Редагувати реєстр</button></Link>
                </form>
                <form className="mx-auto form-inline mt-2 pb-3 update-btn" onSubmit={this.onDeleteRegistry}>
                    <button className="btn btn-danger btn-sm mx-auto"  data-toggle="modal" data-target="#modalDialog" type="button">Видалити реєстр</button>
                    <ModalDialog dangerColor={true} isFetching={this.props.registry.isFetching} titleModal="Підтвердження видалення" textModal=" Ви впевнені, що хочете видалити цей реєстр та ВСІ накладні, що входять до цього реєстру?" actionModal="Видалити" />
                </form>
            </div>
            </React.Fragment>
        );
    }
}

RegistryPage.propTypes = {
    user: PropTypes.object.isRequired,
    registry: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getRegistryByNum: PropTypes.func,
    deleteRegistryByNum: PropTypes.func
};

export default withRouter(connect(RegistryPage.mapStateToProps, RegistryPage.mapDispatchToProps)(RegistryPage));