import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const PanelLink = ({ children, className, location, to }) => {
    const { pathname, search } = location;
    const root = pathname.split('/panel/')[0];
    const href = `${root}/panel/${to}${search}`;
    return (
      <Link className={`unstyled-link ${className}`} to={{ pathname: href, state: location.state }}>
        {children}
      </Link>
    );
};

PanelLink.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    location: PropTypes.shape(),
    to: PropTypes.string
};

export default withRouter(PanelLink);
