import PropTypes from 'prop-types';
import React from 'react';
import styles from './page-content.scss';

const PageContent = ({ children }, { muiTheme }) => (
  <div className={styles.root} style={{ backgroundColor: muiTheme.palette.canvasColor }}>
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
