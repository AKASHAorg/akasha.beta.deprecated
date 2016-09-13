import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Configuration from './components/Configuration';
import {
    SetupActions,
    SyncActions,
    SettingsActions,
    EProcActions,
    BootstrapBundleActions } from 'local-flux';

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
    };
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) =>
        Promise.resolve(new BootstrapBundleActions(dispatch).initConfig(getState))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(Configuration));
