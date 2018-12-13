import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Forbidden from './../../components/special/Forbidden';
import NotAuthorized from './../../components/special/NotAuthorized';
import { updateInfoAboutMe } from './../../actions/user';

export default function requireAuthentication(Component, rolesHaveAcess, customCallback = null) {
    class AuthenticatedComponent extends React.Component {
        constructor(props) {
            super(props);
            if (this.props.user.isLogined) {
                this.props.updateInfoAboutMe();
            }
        }
        showComponent(user) {
            if (!user.isLogined) {
                return <NotAuthorized />;
            } else if (user.isLogined && user.userObject) {
                if (customCallback !== null) {
                    if (customCallback(user.userObject, this.props)) {
                        return <Component {...this.props} />;
                    } else {
                        return <Forbidden />;
                    }
                } else if (rolesHaveAcess === false || rolesHaveAcess.some(roleCheckFunc => roleCheckFunc(user.userObject.role))) {
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

    function mapDispatchToProps(dispatch) {
        return { 
            updateInfoAboutMe: () => dispatch(updateInfoAboutMe())
        };
    }

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent));
}