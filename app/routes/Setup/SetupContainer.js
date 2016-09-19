import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Setup from './components/setup';
import {
    SetupActions,
    SyncActions,
    SettingsActions,
    EProcActions,
    BootstrapBundleActions,
    ExternalProcessBundleActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        settingsState: state.settingsState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        eProcBundleActions: new ExternalProcessBundleActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        return Promise.resolve(bootstrapActions.initSetup(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup));
