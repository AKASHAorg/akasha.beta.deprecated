import { connect } from 'react-redux';
import {
    LoggerActions,
    EProcActions,
    SettingsActions } from 'local-flux';
import SyncStatus from './components/Sync';

function mapStateToProps (state) {
    return {
        gethStatus: state.externalProcState.get('gethStatus'),
        gethErrors: state.externalProcState.get('gethErrors'),
        ipfsStatus: state.externalProcState.get('ipfsStatus'),
        ipfsErrors: state.externalProcState.get('ipfsErrors'),
        configFlags: state.settingsState.get('flags'),
        gethSettings: state.settingsState.get('geth'),
        ipfsSettings: state.settingsState.get('ipfs'),
        gethSyncStatus: state.externalProcState.get('gethSyncStatus'),
        syncActionId: state.externalProcState.get('syncActionId')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        loggerActions: new LoggerActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);
