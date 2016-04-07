import React, { PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import '../../styles/core.scss';

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// LoginLayout is a pure function of its props, so we can
// define it with a plain javascript function...
const style = {
  height: '100%',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};
function LoginLayout({ children }) {
  return (
    <div className='center-xs'
         style={{height: '100%'}}
    >
      <Paper className='col-xs'
             style={style}
      >
        {children}
      </Paper>
    </div>
  );
}

LoginLayout.propTypes = {
  children: PropTypes.element
};


export default LoginLayout;
