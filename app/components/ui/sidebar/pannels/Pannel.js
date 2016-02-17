import React, { PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import Radium from 'radium';

const defaultStyle = {
  boxShadow: '3px 3px 10px rgba(0,0,0,0.16), 3px 3px 10px rgba(0,0,0,0.23)',
  width: '640px',
  height: '100%',
  position: 'absolute',
  left: '64px',
  top: 0,
  zIndex: '999'
};
function ProfilePannel ({ children, style }) {
  style = Object.assign(defaultStyle, style);
  return (
    <Paper
      rounded={false}
      style={style}
      zDepth={2}
    >
      {children}
    </Paper>
  );
}


ProfilePannel.propTypes = {
  children: PropTypes.element,
  style:    PropTypes.object
};


export default Radium(ProfilePannel);
