import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserProfile from './../../components/user/UserProfile';
import { getInfoAboutUser } from './../../actions/user';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.props.getInfoAboutUser(props.match.params.username);
    }

    static mapStateToProps(store) {
        return { currentUser: store.user.userObject , user: store.user.requestedUserObject, isFetching: store.user.requestedUserIsFetching };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            getInfoAboutUser: (username) => dispatch(getInfoAboutUser(username))
        };
    }

    handleChangeRole(e){
        console.log(e);
        e.preventDefault();
    }

    render() { 
        if (!this.props.isFetching && this.props.user && this.props.currentUser) { 
            console.log(this.props.currentUser.login === this.props.user.login, this.props.currentUser.login, this.props.user.login);
        }
        return <div> {!this.props.isFetching && this.props.user && this.props.currentUser && <UserProfile functionCallback={this.handleChangeRole} isMyProfile={this.props.currentUser.login === this.props.user.login} user={this.props.user} />}</div>;
    }
}

UserPage.propTypes = {
    user: PropTypes.object,
    currentUser: PropTypes.object,
    match: PropTypes.object.isRequired,
    isFetching: PropTypes.bool,
    getInfoAboutUser: PropTypes.func.isRequired  
};

export default withRouter(connect(UserPage.mapStateToProps, UserPage.mapDispatchToProps)(UserPage));