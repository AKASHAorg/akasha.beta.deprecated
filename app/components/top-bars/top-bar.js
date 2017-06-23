import PropTypes from 'prop-types';
import React from 'react';
import styles from './top-bar.scss';

const TopBar = (props, { muiTheme }) => (
  <div
    className={`${styles.root} flex-center-y`}
    style={{ backgroundColor: muiTheme.palette.topBarBackgroundColor }}
  >
    <div className={styles.inner}>
      {props.children}
    </div>
  </div>
);

TopBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

TopBar.propTypes = {
    children: PropTypes.element
};

export default TopBar;
