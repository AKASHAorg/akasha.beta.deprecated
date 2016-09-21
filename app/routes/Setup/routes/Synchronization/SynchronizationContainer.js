import { connect } from 'react-redux';
import SyncStatus from './components/Sync';
import { asyncConnect } from 'redux-connect';

import {
    LoggerActions,
    EProcActions,
    ExternalProcessBundleActions,
    BootstrapBundleActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        gethStatus: state.externalProcState.get('gethStatus'),
        gethSettings: state.settingsState.get('geth'),
        gethSyncStatus: state.externalProcState.get('gethSyncStatus'),
        syncActionId: state.externalProcState.get('syncActionId')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        loggerActions: new LoggerActions(dispatch)
    };
}
export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        return Promise.resolve(bootstrapActions.initSync(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus));
