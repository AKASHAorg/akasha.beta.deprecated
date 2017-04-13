import React, { PropTypes } from 'react';
import styles from './secondary-sidebar.scss';

const SecondarySidebar = ({ children }, { muiTheme }) => (
  <div className={styles.root} style={{ backgroundColor: muiTheme.palette.sidebarColor }}>
    {children}
  </div>
);

SecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

SecondarySidebar.propTypes = {
    children: PropTypes.node
};

export default SecondarySidebar;
