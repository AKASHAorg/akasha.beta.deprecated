import { connect } from 'react-redux';
import SyncStatus from './components/Sync';
import {
    SyncActions,
    SetupActions,
    LoggerActions,
    EProcActions,
    ExternalProcessBundleActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig,
        externalProcState: state.externalProcState,
        gethStatus: state.externalProcState.get('gethStatus'),
        gethSyncStatus: state.externalProcState.get('gethSyncStatus')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        eProcBundleActions: new ExternalProcessBundleActions(dispatch),
        setupActions: new SetupActions(dispatch),
        loggerActions: new LoggerActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);
