import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';;
import { isAdmin } from './../../utils/service';
import { updateRegistry, getRegistryByNum } from './../../actions/registry';
import { getAllUsers } from './../../actions/users';
import RegistryForm from './../../components/registry/RegistryForm';
import { goBack } from './../../actions/redirect';
import Forbidden from './../../components/special/Forbidden';


class EditRegistry extends Component {
    constructor(props) {
        super(props);
        const num = props.match.params.number;
        this.registryNum = num;
        this.props.getRegistryByNum(num);
        if (isAdmin(this.props.user.userObject && this.props.user.userObject.role)) {
            this.props.getAllUsers(1, -1);
        }
        this.onFormSubmited = this.onFormSubmited.bind(this);
    }

    static mapStateToProps(store) {
        return { user: store.user, users: store.users, registry: store.registry };
    }

    static mapDispatchToProps(dispatch) {
        return {
            updateRegistry: (number, formData) => dispatch(updateRegistry(number, formData)),
            getRegistryByNum: (number) => dispatch(getRegistryByNum(number)),
            getAllUsers: (page, limit) => dispatch(getAllUsers(page, limit)),
            goBack: () => dispatch(goBack())
        };
    }

    willShowForUser(user, registry) {
        if (user.login === registry.user.login || isAdmin(user.role)) {
            return true;
        }
        return false;
    }

    onFormSubmited(reregistryNumber, formData) {
        this.props.updateRegistry(reregistryNumber, formData);
    }

    getOptionsFromUsers(users) {
        if(!users) return null;
        return users.map(x => {
            return { selectValue: x.login, name: x.fullname };
        });
    }
    
    render() {
        if (!this.props.user.userObject || !this.props.registry.registryObject || !this.props.registry.registryObject.data) {
            return <h1>Loading...</h1>;
        }
        const user = this.props.user.userObject;
        const registry = this.props.registry.registryObject.data;
        if (!this.willShowForUser(user, registry)) {
            return <Forbidden />;
        }
        return <RegistryForm isFetching={this.props.registry.isFetching} registry={registry} user={user} goBackCallback={this.props.goBack} formSubmitCallback={this.onFormSubmited} users={this.getOptionsFromUsers(this.props.users.usersObject && this.props.users.usersObject.data)} />;
    }
}

EditRegistry.propTypes = {
    user: PropTypes.object.isRequired,
    users: PropTypes.object,
    registry: PropTypes.object,
    updateRegistry: PropTypes.func.isRequired,
    getRegistryByNum: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    getAllUsers: PropTypes.func,
    goBack: PropTypes.func
};

export default withRouter(connect(EditRegistry.mapStateToProps, EditRegistry.mapDispatchToProps)(EditRegistry));