import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Configuration from './components/Configuration';
import {
    SetupActions,
    SyncActions,
    SettingsActions,
    EProcActions,
    BootstrapActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig,
        settingsState: state.settingsState
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
        Promise.resolve(new BootstrapActions(dispatch).initConfig(getState))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(Configuration));
