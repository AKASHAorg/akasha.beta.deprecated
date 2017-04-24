import PropTypes from 'prop-types';
import React from 'react';
import { Tutorials } from 'shared-components';
import { connect } from 'react-redux';
import '../../styles/core.scss';

const LoginLayout = (props) => {
    const { children, theme } = props;
    return (
      <div
        style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex'
        }}
      >
        <div style={{ padding: 0, flex: '5 5 auto', maxWidth: '640px' }}>
          {children}
        </div>
        <div
          style={{
              backgroundColor: theme === 'light' ? '#f0f0f0' : '#252525',
              padding: 0,
              flex: '7 7 auto'
          }}
        >
          <Tutorials theme={theme} />
        </div>
      </div>
    );
};

LoginLayout.propTypes = {
    children: PropTypes.element,
    theme: PropTypes.string.isRequired
};

function mapStateToProps (state) {
    return {
        theme: state.settingsState.getIn(['general', 'theme'])
    };
}

export default connect(mapStateToProps)(LoginLayout);
