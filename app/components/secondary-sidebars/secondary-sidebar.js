import PropTypes from 'prop-types';
import React from 'react';
import styles from './secondary-sidebar.scss';

const SecondarySidebar = (props, { muiTheme }) => (
  <div className={styles.root} style={{ backgroundColor: muiTheme.palette.sidebarColor }}>
    {props.children}
  </div>
);

SecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

SecondarySidebar.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
};

export default SecondarySidebar;
