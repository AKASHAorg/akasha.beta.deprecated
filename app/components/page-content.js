import PropTypes from 'prop-types';
import React from 'react';

const PageContent = ({ children }, { muiTheme }) => (
  <div className="page-content" style={{ backgroundColor: muiTheme.palette.pageBackgroundColor }}>
    {children}
  </div>
);

PageContent.contextTypes = {
    muiTheme: PropTypes.shape()
};

PageContent.propTypes = {
    children: PropTypes.node
};

export default PageContent;
