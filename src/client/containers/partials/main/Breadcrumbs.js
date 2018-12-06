import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

// https://www.npmjs.com/package/react-router-breadcrumbs-hoc

////////////////////////////////////////////////////////////////////////////////
// breadcrumbs can be any type of component or string
const UserBreadcrumb = ({ match }) =>
    <span>{match.params.userId}</span>; // use match param userId to fetch/display user name

UserBreadcrumb.propTypes = {
    match: PropTypes.any
};
// define some custom breadcrumbs for certain routes (optional)
const routes = [
    { path: '/users/:userId', breadcrumb: UserBreadcrumb },
    { path: '/s', breadcrumb: null },
];
/////////////////////////////////////////////////////////////////////////////////
 
// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
const Breadcrumbs = ({ breadcrumbs }) => (
    <React.Fragment>
        {breadcrumbs.length > 1 ?  
            <ol className="breadcrumb">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li className={`breadcrumb-item ${index === breadcrumbs.length - 1 && "active"}`} key={breadcrumb.key}>
                        {index === breadcrumbs.length - 1 ? 
                            breadcrumb
                            : 
                            <NavLink to={breadcrumb.props.match.url}>
                            {index === 0 ? <i className="fas fa-home"></i> : breadcrumb}
                            </NavLink>
                        }
                    </li>
                ))}
            </ol>
        : null}
    </React.Fragment>
);

Breadcrumbs.propTypes = {
    breadcrumbs: PropTypes.any
};
 
export default withBreadcrumbs(routes)(Breadcrumbs);