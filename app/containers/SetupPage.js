import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Setup from '../components/startup/Setup';
import * as SetupActions from '../actions/SetupActions';

class SetupPage extends Component {
  render () {
    const {setupConfig, actions} = this.props;
    return (
      <Setup actions={actions}
             setupConfig={setupConfig}
      />
    );
  }
}

SetupPage.propTypes = {
  actions:     PropTypes.object.isRequired,
  setupConfig: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  return {
    setupConfig: state.setupConfig
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(SetupActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupPage);
