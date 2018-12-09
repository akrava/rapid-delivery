import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CURRENT_PATH_REDIRECT } from './../../actions/redirect';
import Forbidden from './../../components/special/Forbidden';


export default function requireAuthentication(Component, rolesHaveAcess, redirectUnlessLogined = false) {
    class AuthenticatedComponent extends React.Component {
        componentDidMount() {
            this.checkAuth(this.props.user);
        }
        
        getDerivedStateFromProps(nextProps) {
            this.checkAuth(nextProps.user);
        }
        
        checkAuth(user) {
            if (!user.isLogined && redirectUnlessLogined) {
                this.props.dispatch({
                    type: CURRENT_PATH_REDIRECT,
                    payload: {
                        method: 'replace',
                        path: '/login'
                    }
                });
            }
        }

        willShowComponent(user) {
            if (user.isLogined && user.userObject) {
                return rolesHaveAcess.some(role => role === user.userObject.role);
            }
            return false;
        }

        render() {
            return (
                <div>
                    {this.willShowComponent(this.props.user) === true
                        ? <Component {...this.props} />
                        : <Forbidden />
                    }
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