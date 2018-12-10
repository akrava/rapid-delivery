import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Forbidden from './../../components/special/Forbidden';
import NotAuthorized from './../../components/special/NotAuthorized';

export default function requireAuthentication(Component, rolesHaveAcess) {
    class AuthenticatedComponent extends React.Component {
        showComponent(user) {
            if (!user.isLogined) {
                return <NotAuthorized />;
            } else if (user.isLogined && user.userObject) {
                if (rolesHaveAcess.some(roleCheckFunc => roleCheckFunc(user.userObject.role))) {
                    return <Component {...this.props} />;
                } else {
                    return <Forbidden />;
                }
            }
            return <NotAuthorized />;
        }

        render() {
            return (
                <div>
                    {this.showComponent(this.props.user)}
                </div>
            );
        }
    }

    function mapStateToProps(store) {
        return {
            user: store.user
        };
    }

    return withRouter(connect(mapStateToProps)(AuthenticatedComponent));
}