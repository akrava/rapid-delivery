import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, /* Link */} from 'react-router-dom';
import { getAllRegistries } from '../../actions/registries';
// import { toFormatedString } from '../../utils/dateConversion';
// import { isAdmin as checkAdminRole, isDefaultUser } from '../../utils/service';
// import NavPagination from '../../components/partials/paginator/NavPagination';

class InvoicesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            typeOfSerach: ''
        };
        // this.searchFormOnSubmit = this.searchFormOnSubmit.bind(this);
        // this.getCurrentPage = this.getCurrentPage.bind(this);
        // this.resetSearchQuery = this.resetSearchQuery.bind(this);
        // this.showRowsOfRegistries = this.showRowsOfRegistries.bind(this);
        // this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
        // this.handleClickNavigation = this.handleClickNavigation.bind(this);
    }

    static mapStateToProps(store) {
        return { registries: store.registries, user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            getAllRegistries: (page, limit, query) => dispatch(getAllRegistries(page, limit, query))
        };
    }

    // componentDidMount() {
    //     if (!this.props.registries.isFetching) {
    //         let page;
    //         if (this.props.registries.registriesObject && this.props.registries.registriesObject.page) {
    //             page = this.props.registries.registriesObject.page;
    //         }
    //         this.props.getAllRegistries(page, this.props.registries.searchField);
    //         this.setState({searchQuery: this.props.registries.searchField || ''});
    //     }
    // }

    // registryRow(registries, isAdmin) {
    //     return registries.map(registry => {
    //         return (
    //             <tr key={registry.number}>
    //                 <td><Link className="link-style text-nowrap" to={`/registries/${registry.number}`}>{registry.number}</Link></td>
    //                 <td><Link className="link-style text-nowrap" to={`/registries/${registry.number}`}>{registry.name}</Link></td> 
    //                 {isAdmin && 
    //                     <td>  
    //                         <Link className="link-style text-nowrap ava" to={`/users/${registry.user.login}`}><img src={registry.user.avaUrl} className="ava small align-middle mr-1" height="30" width="30" />{registry.user.fullname}</Link>
    //                     </td>
    //                 }
    //                 <td className="text-center text-nowrap">{registry.invoices.length}</td>
    //             </tr>
    //         );
    //     });
    // }

    // singleRowInfo(info, isAdmin) {
    //     return (
    //         <tr>
    //             <td colSpan={isAdmin ? 4 : 3 } className="text-center">
    //                 <span className="informal">{info}</span>
    //             </td>
    //         </tr>
    //     );
    // }

    // showRowsOfRegistries() {
    //     const user = this.props.user.userObject;
    //     const searchField = this.state.searchQuery || '';
    //     const isAdmin = checkAdminRole(user.role);
    //     if (this.props.registries.registriesObject === null && !this.props.registries.error) {
    //         return this.singleRowInfo("Завантаження даних", isAdmin);
    //     } else if (this.props.registries.error) {
    //         return this.singleRowInfo("Сталася помилка під час завантаження", isAdmin);
    //     } else if (Array.isArray(this.props.registries.registriesObject.data) && this.props.registries.registriesObject.data.length === 0) {
    //         if (isAdmin) {
    //             if (searchField.trim()) {
    //                 return this.singleRowInfo("Нічого не знайдено", true);
    //             } else {
    //                 return this.singleRowInfo("Немає жодного реєстру", true);
    //             }
    //         } else {
    //             if (searchField.trim()) {
    //                 return this.singleRowInfo("Нічого не знайдено серед моїх ТТН", false);
    //             } else {
    //                 return this.singleRowInfo("Немає жодного мого реєстру", false);
    //             }
    //         }
    //     } else if (Array.isArray(this.props.registries.registriesObject.data) && this.props.registries.registriesObject.data.length > 0) {
    //         return this.registryRow(this.props.registries.registriesObject.data, isAdmin);
    //     } else {
    //         return this.singleRowInfo("Завантаження даних", isAdmin);
    //     }
    // }

    // handleClickNavigation(e) {
    //     if (!this.props.registries.isFetching) {
    //         const page = e.currentTarget.getAttribute("data-page");
    //         if (!page) return;
    //         this.props.getAllRegistries(page, this.state.searchQuery);
    //     }
    // }

    // getCurrentPage() {
    //     let page = 1;
    //     if (this.props.registries.registriesObject && this.props.registries.registriesObject.page) {
    //         page = this.props.registries.registriesObject.page;
    //     }
    //     return page;
    // }

    // textInfo(registries, searchQuery, isAdmin) {
    //     if (searchQuery && searchQuery.trim()) {
    //         return (
    //             <React.Fragment>
    //                 <p>
    //                     Результати пошуку{!isAdmin && " моїх"} реєстрів за запитом 
    //                     `<b>{searchQuery}</b>` по опису та назві.
    //                 </p>
    //                 {registries.data.length > 0 ?
    //                     <p>
    //                         Всього знайдено <b>{registries.totalCount}</b> реєстр(-а)(-ів) за 
    //                         наданим пошуковим запитом{!isAdmin && " у моєму розпорядженні"}. На даній сторінці показано 
    //                         <b> {registries.data.length}</b> реєстр(-а)(-ів).
    //                         Ви знаходитесь на <b>{registries.page}</b> сторінці результатів
    //                         пошуку з <b>{registries.totalPages}</b> всього.<br/>
    //                     </p>
    //                     :
    //                     <p>
    //                         За даним пошуковим запитом{!isAdmin && "серед моїх ТТН"} нічого не знайдено :(
    //                     </p>
    //                 }
    //             </React.Fragment>
    //         );
    //     } else {
    //         return (
    //             <React.Fragment>
    //                 {registries.data.length > 0 ?
    //                     <p>
    //                         Ви знаходитесь на <b>{registries.page}</b> сторінці з 
    //                         <b> {registries.totalPages}</b> всього.<br/>
    //                         Нижче в <i>таблиці</i> наведено <b>{registries.data.length}</b> реєстр(-а)(-ів) з 
    //                         <b> {registries.totalCount}</b> доступного(-их) на даний момент{!isAdmin && " у особистому розпорядженні"}.
    //                     </p>
    //                     :
    //                     <p>
    //                         На жаль, на даний момент немає{!isAdmin && " моїх"} реєстрів накладних.
    //                     </p>
    //                 }
    //             </React.Fragment>
    //         );
    //     }             
    // }

    // headerOfPage(user) {
    //     if (user && checkAdminRole(user.role)) {
    //         return <h1>Список реєстрів</h1>;
    //     } else {
    //         return <h1>Список моїх реєстрів</h1>;
    //     }
    // }

    // onSearchFieldChange(e) {
    //     this.setState({ searchQuery: e.currentTarget.value || ''});
    //     this.props.getAllRegistries(1, e.currentTarget.value || null);
    // }

    // resetSearchQuery() {
    //     this.setState({ searchQuery: '' });
    //     this.props.getAllRegistries();
    // }

    // searchFormOnSubmit(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     this.props.getAllRegistries(this.getCurrentPage(), this.state.searchQuery);
    // }

    render() {
        return (
            <React.Fragment>
            <h1 id="invoices-header">hmmm{/*{#searchQuery}}Результати пошуку{{/searchQuery}}{{^searchQuery}}Список{{^loginedUser.role}} моїх{{/loginedUser.role}} транспортних накладних{{/searchQuery}*/}</h1>
            <div className="row flex-xl-row px-3">
                <div className="col-xl-8" id="invoices-page-stats">
                    {/* {{#searchQuery}}
                        <p>
                            Результати пошуку{{^loginedUser.role}} серед моїх{{/loginedUser.role}} транспортних накладних за запитом 
                            `<b>{{searchQuery}}</b>` по {{searchType.name}} накладної.
                        </p>
                        <p>
                            {{#invoices.0}}
                                Всього знайдено <b>{{totalCount}}</b> накладну(-і)(-их) за 
                                наданим пошуковим запитом{{^loginedUser.role}} серед моїх ТТН{{/loginedUser.role}}. На даній сторінці показано 
                                <b>{{currentCount}}</b> накладну(-і)(-их).
                                Ви знаходитесь на <b>{{currentPage}}</b> сторінці результатів
                                пошуку з <b>{{pages.length}}</b> всього.<br> 
                            {{/invoices.0}}
                            {{^invoices.0}}
                                За даним пошуковим запитом{{^loginedUser.role}} серед моїх ТТН{{/loginedUser.role}} нічого не знайдено :(
                            {{/invoices.0}}
                        </p>
                    {{/searchQuery}}
                    {{^searchQuery}}
                        <p>
                            {{#invoices.0}}
                                Ви знаходитесь на <b>{{currentPage}}</b> сторінці з 
                                <b>{{pages.length}}</b> всього.<br>
                                Нижче в <i>списку</i> наведено <b>{{currentCount}}</b> накладну(-і)(-их) з 
                                <b>{{totalCount}}</b> доступної(-их) на даний момент{{^loginedUser.role}} у особистому розпорядженні{{/loginedUser.role}}.
                            {{/invoices.0}}
                            {{^invoices.0}}
                                На жаль, на даний момент немає{{^loginedUser.role}} ваших{{/loginedUser.role}} накладних.
                            {{/invoices.0}}
                        </p>
                    {{/searchQuery}} */}
                </div>
                <div className="col-xl-4 search-block py-2">
                    <p className="text-center mb-0">Пошук накладної:</p>
                    <form id="search" action="/invoices/" className="form-inline mb-1" method="GET">
                        <label className="text-center w-100 pb-2">За:
                            <select name="t" id="type-search" className="ml-2 form-control custom-select form-control-sm">
                                {/* <option value="num" {{^searchType}}selected{{/searchType}} {{#searchType.num}}selected{{/searchType.num}}>номером</option>
                                <option value="description" {{#searchType.desc}}selected{{/searchType.desc}}>описом</option>
                                <option value="location" {{#searchType.loc}}selected{{/searchType.loc}}>пот. положенням</option> */}
                            </select>
                        </label>
                        <div className="input-group mr-2 ml-auto">
                            <input className="form-control form-control-sm" name="q" id="search-field" type="text"  placeholder="№ квитанції" maxLength="50" aria-label="Пошук" />
                            <div className="input-group-append">
                                <div className="input-group-text hover-st" id="clear-search"><small>✗</small></div>
                            </div>
                        </div>
                        <button className="btn btn-outline-primary btn-sm mr-auto ml-sm-0 ml-auto mt-sm-0 mt-2" type="submit">Пошук</button>
                    </form>
                </div>
            </div>
            <div className="d-flex p-3">
                <a href="/invoices/new" className="btn btn-primary mx-auto " type="button">Створення товарно-транспортної накладної</a>
            </div>
            <p>
                Можна переглянути окрему сторінку кожної товарно-транспортної накладної:
            </p>
            <div className="pagination-wrapper"> 
                <ul id="invoices" className="mx-auto">
                    {/* {{#invoices}}
                        <li><a target="_blank" className="link-style" href="/invoices/{{number}}"><img src="{{photoPath}}" height="30" width="30" className="ava small middle mr-1">ТТН №{{number}}</a></li>
                    {{/invoices}}
                    {{^invoices}}
                        <span className="informal">{{#searchQuery}}Нічого не знайдено{{^loginedUser.role}} серед моїх ТТН{{/loginedUser.role}}{{/searchQuery}}{{^searchQuery}}В реєстрі немає жодної{{^loginedUser.role}} моєї{{/loginedUser.role}} накладної{{/searchQuery}}</span>
                    {{/invoices}} */}
                </ul>
            </div>
            
            
           
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
    registries: PropTypes.object.isRequired,
    getAllRegistries: PropTypes.func.isRequired  
};

export default withRouter(connect(InvoicesTable.mapStateToProps, InvoicesTable.mapDispatchToProps)(InvoicesTable));                