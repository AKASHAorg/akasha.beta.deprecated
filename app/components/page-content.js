import PropTypes from 'prop-types';
import React from 'react';

const PageContent = ({ children, showSecondarySidebar }) => (
  <div className={`page-content page-content${showSecondarySidebar ? '' : '_full'}`}>
    {children}
  </div>
);

PageContent.propTypes = {
    children: PropTypes.node,
    showSecondarySidebar: PropTypes.bool,
};

export default PageContent;
