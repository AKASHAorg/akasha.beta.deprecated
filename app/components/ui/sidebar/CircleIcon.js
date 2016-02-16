import React, { PropTypes } from 'react';
import Radium from 'radium';
import './styles/circleicon.scss';


function CircleIcon ({ children, style }) {
style = Object.assign(style, {marginTop: '16px'});
  return (
    <div
        style={style}
        className="hand-icon"
      >
        {children}
    </div>
  );
}


CircleIcon.propTypes = {
  children: PropTypes.element,
  style: PropTypes.object
};


export default Radium(CircleIcon);
