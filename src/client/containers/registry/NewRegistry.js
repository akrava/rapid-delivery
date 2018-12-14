import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';;
import { isAdmin } from './../../utils/service';
import { createRegistry } from './../../actions/registry';
import { getAllUsers } from './../../actions/users';
import RegistryForm from './../../components/registry/RegistryForm';
import { goBack } from './../../actions/redirect';


class NewRegistry extends Component {
    constructor(props) {
        super(props);
        if (isAdmin(this.props.user.userObject && this.props.user.userObject.role)) {
            this.props.getAllUsers(1, -1);
        }
        this.onFormSubmited = this.onFormSubmited.bind(this);
        // this.onDeleteRegistry = this.onDeleteRegistry.bind(this);
    }

    static mapStateToProps(store) {
        return { user: store.user, users: store.users, registry: store.registry };
    }

    static mapDispatchToProps(dispatch) {
        return {
            createRegistry: (formData) => dispatch(createRegistry(formData)),
            getAllUsers: (page, limit) => dispatch(getAllUsers(page, limit)),
            goBack: () => dispatch(goBack())
        };
    }

    onFormSubmited(reregistryNumber, formData) {
        this.props.createRegistry(formData);
    }

    invoicesList(invoices) {
        return invoices.map(invoice => {
            return <li key={invoice}><Link className="link-style" to={`/invoices/${invoice}`}>{invoice}</Link></li>;
        });
    }

    getOptionsFromUsers(users) {
        if(!users) return null;
        return users.map(x => {
            return { selectValue: x.login, name: x.fullname };
        });
    }
    
    render() {
        return <RegistryForm isFetching={this.props.registry && this.props.registry.isFetching} registry={null} user={this.props.user.userObject} goBackCallback={this.props.goBack} formSubmitCallback={this.onFormSubmited} users={this.getOptionsFromUsers(this.props.users.usersObject && this.props.users.usersObject.data)} />;
    }
}

NewRegistry.propTypes = {
    user: PropTypes.object.isRequired,
    users: PropTypes.object,
    registry: PropTypes.object,
    createRegistry: PropTypes.func.isRequired,
    getAllUsers: PropTypes.func,
    goBack: PropTypes.func
};

export default withRouter(connect(NewRegistry.mapStateToProps, NewRegistry.mapDispatchToProps)(NewRegistry));