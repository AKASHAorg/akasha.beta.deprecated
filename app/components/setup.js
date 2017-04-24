import PropTypes from 'prop-types';
import React from 'react';
import { Tutorials } from '../shared-components';

function Setup ({ children }, { muiTheme }) {
    const { palette } = muiTheme;
    return (
      <div style={{ display: 'flex', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 0, flex: '5 5 auto', maxWidth: '640px' }}>
          {children}
        </div>
        <div
          style={{
              backgroundColor: palette.tutorialsBackgroundColor,
              padding: 0,
              flex: '7 7 auto'
          }}
        >
          <Tutorials />
        </div>
      </div>
    );
}

Setup.contextTypes = {
    muiTheme: PropTypes.shape()
};

Setup.propTypes = {
    children: PropTypes.element
};

export default Setup;
