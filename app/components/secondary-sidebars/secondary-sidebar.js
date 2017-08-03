import PropTypes from 'prop-types';
import React from 'react';

const SecondarySidebar = props => (
  <div
    className={`secondary-sidebar secondary-sidebar${props.shown ? '' : '_collapsed'}`}
  >
    {props.children}
  </div>
);

SecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

SecondarySidebar.propTypes = {
    children: PropTypes.element,
    shown: PropTypes.bool
};

export default SecondarySidebar;
