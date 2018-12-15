import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isAdmin as checkAdminRights } from './../../utils/service';
import { createInvoice } from './../../actions/invoice';
import { getAllUsers } from './../../actions/users';
import InvoiceForm from './../../components/invoice/InvoiceForm';
import { goBack } from './../../actions/redirect';


class NewInvoice extends Component {
    constructor(props) {
        super(props);
        this.props.getAllUsers(1, -1);
        this.onFormSubmited = this.onFormSubmited.bind(this);
    }

    static mapStateToProps(store) {
        return { user: store.user, users: store.users, registry: store.registry, invoice: store.invoice };
    }

    static mapDispatchToProps(dispatch) {
        return {
            createInvoice: (formData) => dispatch(createInvoice(formData)),
            getAllUsers: (page, limit) => dispatch(getAllUsers(page, limit)),
            goBack: () => dispatch(goBack())
        };
    }

    onFormSubmited(reregistryNumber, formData) {
        this.props.createInvoice(formData);
    }

    getOptionsFromUsers(users, username, isAdmin) {
        if(!users) return null;
        if (!isAdmin) {
            users = users.filter(x => x.login !== username);
        }
        return users.map(x => {
            return { selectValue: x.login, name: x.fullname };
        });
    }

    getGroup(users) {
        if(!users) return null;
        return users.map(user => {
            return {
                label: user.fullname,
                username: user.login,
                value: user.registries.map(y => {
                    return {
                        name: `№${y.number} - ${y.name}`,
                        selectValue: y.number
                    };
                })
            };
        });
    }

    myRegistries(user) {
        return user.registries.map(y => {
            return {
                name: `№${y.number} - ${y.name}`,
                selectValue: y.number
            };
        });
    }
    
    render() {
        if (!this.props.users.usersObject) {
            return <h1>Loading...</h1>;
        }
        const user = this.props.user.userObject;
        const users = this.props.users.usersObject.data;
        const isAdmin = checkAdminRights(user.role);
        return <InvoiceForm 
            registriesArr={isAdmin ? this.getGroup(users) : this.myRegistries(user)} 
            isFetching={this.props.invoice.isFetching} 
            registry={null} 
            user={user} 
            goBackCallback={this.props.goBack} 
            formSubmitCallback={this.onFormSubmited} 
            users={this.getOptionsFromUsers(isAdmin ? users : this.props.users.usersObject , user.login, isAdmin)} 
        />;
    }
}

NewInvoice.propTypes = {
    user: PropTypes.object.isRequired,
    users: PropTypes.object,
    registry: PropTypes.object,
    invoice: PropTypes.object,
    createInvoice: PropTypes.func.isRequired,
    getAllUsers: PropTypes.func,
    goBack: PropTypes.func
};

export default withRouter(connect(NewInvoice.mapStateToProps, NewInvoice.mapDispatchToProps)(NewInvoice));