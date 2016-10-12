import { connect } from 'react-redux';
import {
    EProcActions,
    SettingsActions } from 'local-flux';
import SyncStatus from './components/Sync';

function mapStateToProps (state) {
    return {
        gethStatus: state.externalProcState.get('gethStatus'),
        gethErrors: state.externalProcState.get('gethErrors'),
        gethLogs: state.externalProcState.get('gethLogs'),
        ipfsStatus: state.externalProcState.get('ipfsStatus'),
        ipfsErrors: state.externalProcState.get('ipfsErrors'),
        configFlags: state.settingsState.get('flags'),
        gethSettings: state.settingsState.get('geth'),
        fetchingGethSettings: state.settingsState.get('fetchingGethSettings'),
        fetchingIpfsSettings: state.settingsState.get('fetchingIpfsSettings'),
        gethSyncStatus: state.externalProcState.get('gethSyncStatus'),
        syncActionId: state.externalProcState.get('syncActionId'),
        gethBusyState: state.externalProcState.get('gethBusyState'),
        timestamp: state.appState.get('timestamp')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);
