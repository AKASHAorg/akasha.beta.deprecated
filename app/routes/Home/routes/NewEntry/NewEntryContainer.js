import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { ProfileActions, EntryActions, BootstrapActions } from 'local-flux';
import AddEntryPage from './components/add-entry';


function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryState: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default asyncConnect([{
    promise: ({store: {dispatch, getState}, params}) =>
        Promise.resolve(new BootstrapActions(dispatch).initEntryEditor(getState, params))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEntryPage));
