import PropTypes from 'prop-types';
import React from 'react';

const PageContent = ({ children }) => (
  <div className="page-content">
    {children}
  </div>
);

PageContent.propTypes = {
    children: PropTypes.node
};

export default PageContent;
