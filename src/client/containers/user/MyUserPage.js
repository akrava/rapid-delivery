import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UserProfile from './../../components/user/UserProfile';

class MyUserPage extends Component {
    static mapStateToProps(store) {
        return { user: store.user };
    }

    render() {
        return <div> {this.props.user && this.props.user.userObject && <UserProfile isMyProfile={true} user={this.props.user.userObject} />}</div>;
    }
}

MyUserPage.propTypes = {
    user: PropTypes.object.isRequired
};

export default withRouter(connect(MyUserPage.mapStateToProps)(MyUserPage));