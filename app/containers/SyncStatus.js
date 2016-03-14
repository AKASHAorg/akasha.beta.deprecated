import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SyncStatus from '../components/startup/SyncStatus';
import * as SyncActions from '../actions/SyncActions';

function mapStateToProps (state) {
  return {
    syncState: state.syncStatus
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(SyncActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncStatus);
