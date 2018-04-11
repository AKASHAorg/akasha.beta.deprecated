import { connect } from 'react-redux';
import { clearSyncStatus, gethGetSyncStatus, gethPauseSync, gethResumeSync, gethStart,
    gethStartLogger, gethStop, gethStopLogger, gethStopSync, ipfsGetPorts, ipfsStart,
    ipfsStop } from '../local-flux/actions/external-process-actions';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';
import { Sync } from '../components';

function mapStateToProps (state) {
    return {
        configurationSaved: state.settingsState.getIn(['general', 'configurationSaved']),
        gethBusyState: state.externalProcState.getIn(['geth', 'flags', 'busyState']),
        gethStarting: state.externalProcState.getIn(['geth', 'gethStarting']),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        gethStatusFetched: state.externalProcState.getIn(['geth', 'flags', 'statusFetched']),        
        gethSyncStatus: state.externalProcState.getIn(['geth', 'syncStatus']),
        ipfsBusyState: state.externalProcState.getIn(['ipfs', 'flags', 'busyState']),
        ipfsPortsRequested: state.externalProcState.getIn(['ipfs', 'portsRequested']),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
        ipfsStatusFetched: state.externalProcState.getIn(['ipfs', 'flags', 'statusFetched']),        
        syncActionId: state.externalProcState.getIn(['geth', 'syncActionId']),
    };
}

export default connect(
    mapStateToProps,
    {
        clearSyncStatus,
        gethGetSyncStatus,
        gethPauseSync,
        gethResumeSync,
        gethStart,
        gethStartLogger,
        gethStop,
        gethStopLogger,
        gethStopSync,
        ipfsGetPorts,
        ipfsStart,
        ipfsStop,
        saveGeneralSettings,
    },
    null,
    { pure: false }
)(Sync);
