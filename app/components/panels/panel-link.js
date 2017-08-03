import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PanelLink = ({ children, location, to }) => {
    const { pathname, search } = location;
    const root = pathname.split('/panel/')[0];
    const href = `${root}/panel/${to}${search}`;
    return (
      <Link className="unstyled-link" to={href}>
        {children}
      </Link>
    );
};

PanelLink.propTypes = {
    children: PropTypes.node,
    location: PropTypes.shape(),
    to: PropTypes.string
};

export default withRouter(PanelLink);
