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
        gethSettings: state.settingsState.get('geth'),
        ipfsSettings: state.settingsState.get('ipfs'),
        configFlags: state.settingsState.get('flags'),
        isAdvanced: state.settingsState.get('isAdvanced'),
        userSettings: state.settingsState.get('userSettings')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
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
