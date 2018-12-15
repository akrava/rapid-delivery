import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';;
import { isAdmin as checkAdmin } from './../../utils/service';
import Forbidden from './../../components/special/Forbidden';
import { toFormatedString } from './../../utils/dateConversion';
import ModalDialog from './../../components/partials/modals/ModalDialog';
import { getInvoiceByNum, deleteInvoiceByNum } from './../../actions/invoice';


class InvoicePage extends Component {
    constructor(props) {
        super(props);
        const num = props.match.params.number;
        this.invoiceNum = num;
        this.props.getInvoiceByNum(num);
        this.onDeleteInvoice = this.onDeleteInvoice.bind(this);
    }

    static mapStateToProps(store) {
        return { invoice: store.invoice, user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            getInvoiceByNum: (number) => dispatch(getInvoiceByNum(number)),
            deleteInvoiceByNum: (number) => dispatch(deleteInvoiceByNum(number))
        };
    }

    willShowForUser(user, invoice) {
        if (user.login === invoice.sender.login || user.login === invoice.recipient.login || checkAdmin(user.role)) {
            return true;
        }
        return false;
    }

    checkIsRecipient(user, invoice) {
        if (user.login === invoice.recipient.login) {
            return true;
        }
        return false;
    }

    onDeleteInvoice(e) {
        e.preventDefault();
        this.props.deleteInvoiceByNum(this.invoiceNum);
    }
    
    render() {
        let invoice = this.props.invoice.invoiceObject;
        const user = this.props.user.userObject;
        if (!invoice || !invoice.data || !invoice.data.sender || !user) return <h1>Loading...</h1>;
        invoice = invoice.data;
        const isAdmin = checkAdmin(user.role);
        const isRecipient = this.checkIsRecipient(user, invoice);
        if (!this.willShowForUser(user, invoice)) {
            return <Forbidden />;
        }
        return (
            <React.Fragment>
            <h1>Накладна №{invoice.number}</h1>
            <div className="table-responsive p-3">  
                <table className="mx-auto styled captioned mt-3 mb-5" id="users">
                    <caption>ТТН #{invoice.number}</caption>
                    <tbody>
                        <tr>
                            <td>Номер відправлення</td>
                            <td>{invoice.number}</td>
                        </tr>
                        {(isAdmin || !isRecipient) &&
                            <tr>
                                <td>Реєстр</td>
                                <td><Link className="link-style" to={`/registries/${invoice.registry.number}`}>{invoice.registry.number} - {invoice.registry.name}</Link></td>
                            </tr>
                        }
                        <tr>
                            <td>Відправник</td>
                            {(isAdmin || !isRecipient) 
                                ?
                                <td><Link className="link-style ava" to={`/users/${invoice.sender.login}`}><img src={invoice.sender.avaUrl} height={30} width={30} className="ava small mr-1"/>{invoice.sender.fullname}</Link></td>
                                :
                                <td><img src={invoice.sender.avaUrl} height={30} width={30} className="ava small mr-1"/>{invoice.sender.fullname}</td>
                            }
                        </tr>
                        <tr>
                            <td>Отримувач</td>
                            {(isAdmin || isRecipient) 
                                ?
                                <td><Link className="link-style ava" to={`/users/${invoice.recipient.login}`}><img src={invoice.recipient.avaUrl} height={30} width={30} className="ava small mr-1"/>{invoice.recipient.fullname}</Link></td>
                                :
                                <td><img src={invoice.recipient.avaUrl} height={30} width={30} className="ava small mr-1"/>{invoice.recipient.fullname}</td>
                            }
                        </tr>
                        <tr>
                            <td>Дата відправленя</td>
                            <td>{toFormatedString(invoice.departure)}</td>
                        </tr>
                        <tr>
                            <td>Дата прибуття</td>
                            <td>{toFormatedString(invoice.arrival)}</td>
                        </tr>
                        <tr>
                            <td>Поточне місцезнаходження</td>
                            <td>{invoice.location}</td>
                        </tr>
                        <tr>
                            <td>Опис вантажу</td>
                            <td>{invoice.description}</td>
                        </tr>
                        <tr>
                            <td>Вартість доставки, грн.</td>
                            <td>{invoice.cost}</td>
                        </tr>
                        <tr>
                            <td>Вага, кг</td>
                            <td>{invoice.weight}</td>
                        </tr>
                    </tbody>
                </table>
            </div>  
            <div className="gallery text-center p-3 pb-4">
                <p className="font-weight-bold text-center">Фото відправлення:</p>
                <img className="view-default img-fluid mx-auto" style={{maxHeight: "500px"}} src={invoice.photoPath}/>
            </div>
            {!isAdmin && isRecipient
                ?
                <div><p className="text-center mt-3">Лише перегляд</p></div>
                :
                <div>
                    <p className="text-center mt-4">Дії з накладною:</p>
                    <div className="actions default-form mb-3">    
                        <form className="mx-auto form-inline pt-3 update-btn" action="/invoices/edit" method="POST">          
                            <Link className="mx-auto" to={`/invoices/${this.invoiceNum}/edit`}><button className="btn btn-primary btn-sm mx-auto" role="button">Редагувати накладну</button></Link>
                        </form>
                        <form className="mx-auto form-inline mt-2 pb-3 update-btn" action="/invoices/remove" onSubmit={this.onDeleteInvoice} method="POST">
                            <button className="btn btn-danger btn-sm mx-auto"  data-toggle="modal" data-target="#modalDialog" type="button">Видалити накладну</button>
                            <ModalDialog dangerColor={true} isFetching={this.props.invoice.isFetching} titleModal="Підтвердження видалення" textModal="Ви впевнені, що хочете видалити цю накладну?" actionModal="Видалити" />
                        </form>
                    </div>
                </div>
            }
            </React.Fragment>
        );
    }
}

InvoicePage.propTypes = {
    user: PropTypes.object.isRequired,
    invoice: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    getInvoiceByNum: PropTypes.func,
    deleteInvoiceByNum: PropTypes.func
};

export default withRouter(connect(InvoicePage.mapStateToProps, InvoicePage.mapDispatchToProps)(InvoicePage));