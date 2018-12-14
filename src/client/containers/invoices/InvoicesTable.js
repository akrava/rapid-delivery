import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { getAllInvoices } from '../../actions/invoices';
// import { toFormatedString } from '../../utils/dateConversion';
import { isAdmin as checkAdminRole } from '../../utils/service';
import NavPagination from '../../components/partials/paginator/NavPagination';

class InvoicesTable extends Component {
    constructor(props) {
        super(props);   
        this.getQueryAndCurrentPage = this.getQueryAndCurrentPage.bind(this);
        this.handleClickNavigation = this.handleClickNavigation.bind(this);
        this.showRowsOfInvoices = this.showRowsOfInvoices.bind(this);
        this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
        this.resetSearchQuery = this.resetSearchQuery.bind(this);
        this.searchFormOnSubmit = this.searchFormOnSubmit.bind(this);
        this.inputSearchRef = React.createRef();
        const objParams = this.getQueryAndCurrentPage();
        this.state = {
            searchQuery: objParams.searchQuery || '',
            typeOfSearch: objParams.typeOfSearch ||  ''
        };
        this.props.getAllInvoices(objParams.page, objParams.searchQuery, objParams.typeOfSearch);
    }

    static mapStateToProps(store) {
        return { invoices: store.invoices, user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            getAllInvoices: (page, query, type, limit) => dispatch(getAllInvoices(page, query, type, limit))
        };
    }

    invoiceItem(invoices) {
        return invoices.map(invoice => {
            return (
                <li key={invoice.number}><Link className="link-style" to={`/invoices/${invoice.number}`}><img src={invoice.photoPath} height="30" width="30" className="ava small middle mr-1" />ТТН №{invoice.number}</Link></li>
            );
        });
    }

    singleRowInfo(info) {
        return (
            <span className="informal">{info}</span>
        );
    }

    showRowsOfInvoices() {
        const user = this.props.user.userObject;
        const searchField = this.state.searchQuery || '';
        const isAdmin = checkAdminRole(user.role);
        if (!this.props.invoices.invoicesObject && !this.props.invoices.error) {
            return this.singleRowInfo("Завантаження даних");
        } else if (this.props.invoices.error) {
            return this.singleRowInfo("Сталася помилка під час завантаження");
        } else if (Array.isArray(this.props.invoices.invoicesObject.data) && this.props.invoices.invoicesObject.data.length === 0) {
            if (isAdmin) {
                if (searchField.trim()) {
                    return this.singleRowInfo("Нічого не знайдено");
                } else {
                    return this.singleRowInfo("В реєстрі немає жодної накладної");
                }
            } else {
                if (searchField.trim()) {
                    return this.singleRowInfo("Нічого не знайдено серед моїх ТТН");
                } else {
                    return this.singleRowInfo("В реєстрі немає жодної моєї накладної");
                }
            }
        } else if (Array.isArray(this.props.invoices.invoicesObject.data) && this.props.invoices.invoicesObject.data.length > 0) {
            return this.invoiceItem(this.props.invoices.invoicesObject.data);
        } else {
            return this.singleRowInfo("Завантаження даних");
        }
    }

    handleClickNavigation(e) {
        if (!this.props.invoices.isFetching) {
            const page = e.currentTarget.getAttribute("data-page");
            if (!page) return;
            this.props.getAllInvoices(page, this.state.searchQuery, this.state.typeOfSearch);
        }
    }

    getQueryAndCurrentPage() {
        if (this.state && (this.state.searchQuery || this.state.typeOfSearch)) {
            return {
                searchQuery: this.state.searchQuery,
                typeOfSearch: this.state.typeOfSearch,
                page: this.props.invoices.invoicesObject ? this.props.invoices.invoicesObject.page : 1
            };
        }
        if (this.props.invoices.invoicesObject) {
            const page = this.props.invoices.invoicesObject.page;
            const query = this.props.invoices.searchField;
            const type = this.props.invoices.typeOfQuery;
            return {
                searchQuery: query || '',
                typeOfSearch: type || '',
                page: page || 1
            };
        }
        return false;
    }

    textInfo(invoices, searchQuery, searchType, isAdmin) {
        if (searchQuery && searchQuery.trim()) {
            return (
                <React.Fragment>
                    <p>
                        Результати пошуку{!isAdmin && " серед моїх"} транспортних накладних за запитом 
                        `<b>{searchQuery}</b>` по {searchType} накладної.
                    </p>
                        {invoices.data.length > 0 
                        ?
                            <p>
                                Всього знайдено <b>{invoices.totalCount}</b> накладну(-і)(-их) за 
                                наданим пошуковим запитом{!isAdmin && " серед моїх ТТН"}. На даній сторінці показано 
                                <b> {invoices.data.length}</b> накладну(-і)(-их).
                                Ви знаходитесь на <b>{invoices.page}</b> сторінці результатів
                                пошуку з <b>{invoices.totalPages}</b> всього.<br/> 
                            </p>
                        :
                            <p>
                                За даним пошуковим запитом{!isAdmin && " серед моїх ТТН"} нічого не знайдено :(
                            </p>
                        }
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {invoices.data.length > 0 ?
                        <p>
                            Ви знаходитесь на <b>{invoices.page}</b> сторінці з 
                            <b> {invoices.totalPages}</b> всього.<br />
                            Нижче в <i>списку</i> наведено <b>{invoices.data.length}</b> накладну(-і)(-их) з 
                            <b> {invoices.totalCount}</b> доступної(-их) на даний момент{!isAdmin && " у особистому розпорядженні"}.
                        </p>
                        :
                        <p>
                            На жаль, на даний момент немає{!isAdmin && " ваших"} накладних.
                        </p>
                    }
                </React.Fragment>
            );
        }             
    }

    headerOfPage(user, searchField) {
        if (user && checkAdminRole(user.role)) {
            return <h1>{searchField ? "Результати пошуку" : "Список транспортних накладних"}</h1>;
        } else if (user) {
            return <h1>{searchField ? "Результати пошуку" : "Список моїх транспортних накладних"}</h1>;
        } else {
            return <h1>Loading...</h1>;
        }
    }

    getTextOfTypeSearch(typeOfSearch) {
        switch (typeOfSearch) {
            case "num": return "номеру";
            case "description": return "опису";
            case "location": return "поточному місцезнаходженню";
            default: return "none";
        }
    }

    onSearchFieldChange(isTypeOfSearch) {
        const type = isTypeOfSearch;
        const this_obj = this;
        return function(e) {
            const obj = {};
            obj[type ? "typeOfSearch" : "searchQuery"] = e.currentTarget.value || '';
            this_obj.setState(obj);
            const searchOpt = this_obj.getQueryAndCurrentPage();
            this_obj.props.getAllInvoices(1, type ? searchOpt.searchQuery : e.currentTarget.value || null, type ?  e.currentTarget.value || null : searchOpt.typeOfSearch);
            if (isTypeOfSearch) {
                let placeholder; 
                switch (e.currentTarget.value) {
                    case "num": placeholder = "№ квитанції"; break;
                    case "description": placeholder = "Опис"; break;
                    case "location": placeholder = "Місцезнаходження"; break;
                    default: placeholder = "none"; break;
                }
                this_obj.inputSearchRef.current.setAttribute("placeholder", placeholder);
            }
        }; 
    }

    resetSearchQuery() {
        this.setState({ searchQuery: '' });
        this.props.getAllInvoices();
    }

    searchFormOnSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.getAllInvoices(1, this.state.searchQuery, this.state.typeOfSearch);
    }

    render() {
        return (
            <React.Fragment>
            {this.headerOfPage(this.props.user.userObject, this.state.searchQuery)}
            <div className="row flex-xl-row px-3">
                <div className="col-xl-8" id="invoices-page-stats">
                {this.props.user.userObject && this.props.invoices.invoicesObject
                        ? this.textInfo(this.props.invoices.invoicesObject, this.state.searchQuery, this.getTextOfTypeSearch(this.state.typeOfSearch), checkAdminRole(this.props.user.userObject.role)) 
                        : <p>loading...</p>
                    }
                </div>
                <div className="col-xl-4 search-block py-2">
                    <p className="text-center mb-0">Пошук накладної:</p>
                    <form id="search" action="/invoices/" className="form-inline mb-1" onSubmit={this.searchFormOnSubmit} method="GET">
                        <label className="text-center w-100 pb-2">За:
                            <select name="t" onChange={this.onSearchFieldChange(true)} value={this.state.typeOfSearch} id="type-search" className="ml-2 form-control custom-select form-control-sm">
                                <option value="num">номером</option>
                                <option value="description">описом</option>
                                <option value="location">пот. положенням</option>
                            </select>
                        </label>
                        <div className="input-group mr-2 ml-auto">
                            <input className="form-control form-control-sm h-auto"  onChange={this.onSearchFieldChange(false)} value={this.state.searchQuery} name="q" id="search-field" type="text" ref={this.inputSearchRef}  placeholder="№ квитанції" maxLength={50} aria-label="Пошук" />
                            <div className="input-group-append">
                                <div className="input-group-text hover-st" onClick={this.resetSearchQuery} id="clear-search"><small>✗</small></div>
                            </div>
                        </div>
                        <button className="btn btn-outline-primary btn-sm mr-auto ml-sm-0 ml-auto mt-sm-0 mt-2" type="submit">Пошук</button>
                    </form>
                </div>
            </div>
            <div className="d-flex p-3">
                <Link to="/invoices/new" className="btn btn-primary mx-auto " role="button">Створення товарно-транспортної накладної</Link>
            </div>
            <p>
                Можна переглянути окрему сторінку кожної товарно-транспортної накладної:
            </p>
            <div className="pagination-wrapper"> 
                <ul id="invoices" className="mx-auto">
                    {this.showRowsOfInvoices()}
                </ul>
            </div>
            {this.props.invoices.invoicesObject &&
                <NavPagination page={this.props.invoices.invoicesObject.page} totalPages={this.props.invoices.invoicesObject.totalPages} isFetching={this.props.invoices.isFetching} callbackPageClicked={this.handleClickNavigation} />
            }
            <p>
                На сторінці накладної можна дізнатися дату відправлення/прибуття, відправника,
                одержувача та іншу супутню інфориацію, а також є можливість редагування та видалення.
            </p>
            </React.Fragment>
        );
    }
}

InvoicesTable.propTypes = {
    user: PropTypes.object.isRequired,
    invoices: PropTypes.object.isRequired,
    getAllInvoices: PropTypes.func.isRequired  
};

export default withRouter(connect(InvoicesTable.mapStateToProps, InvoicesTable.mapDispatchToProps)(InvoicesTable));                