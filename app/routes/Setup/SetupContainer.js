import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Setup from './components/setup';
import {
    SetupActions,
    SyncActions,
    SettingsActions,
    EProcActions,
    BootstrapActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        setupActions: new SetupActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        syncActions: new SyncActions(dispatch),
    };
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) =>
        Promise.resolve(new BootstrapActions(dispatch).initSetup(getState))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup));
