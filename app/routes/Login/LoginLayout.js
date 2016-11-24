import React, { PropTypes } from 'react';
import { Tutorials } from 'shared-components';
import { connect } from 'react-redux';
import '../../styles/core.scss';

// Note: Stateless/function shared-components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// LoginLayout is a pure function of its props, so we can
// define it with a plain javascript function...
const LoginLayout = (props) => {
    const { children, theme } = props;
    return (
      <div
        className="col-xs-12"
        style={{
            padding: 0,
            overflow: 'hidden'
        }}
      >
        <div className="col-xs-5" style={{ padding: 0 }}>
          {children}
        </div>
        <div
          className="col-xs-7"
          style={{
              backgroundColor: theme === 'light' ? '#f3f3f3' : '#252525',
              padding: 0
          }}
        >
          <Tutorials theme={theme} />
        </div>
      </div>
    );
};

LoginLayout.propTypes = {
    children: PropTypes.element,
    theme: PropTypes.string
};

function mapStateToProps (state, ownProps) {
    return {
        theme: state.settingsState.getIn(['general', 'theme'])
    };
}

function mapDispatchToProps () {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginLayout);
