import { connect } from 'react-redux';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { gethGetSyncStatus, gethPauseSync, gethResumeSync, gethStart, gethStartLogger, gethStop,
    gethStopLogger, gethStopSync, ipfsStart,
    ipfsStop } from '../local-flux/actions/external-process-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { Sync } from '../components';

function mapStateToProps (state, ownProps) {
    return {
        configurationSaved: state.settingsState.getIn(['general', 'configurationSaved']),
        gethBusyState: state.externalProcState.getIn(['geth', 'flags', 'busyState']),
        gethLogs: state.externalProcState.getIn(['geth', 'logs']),
        gethStarting: state.externalProcState.getIn(['geth', 'gethStarting']),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        gethSyncStatus: state.externalProcState.getIn(['geth', 'syncStatus']),
        ipfsBusyState: state.externalProcState.getIn(['ipfs', 'flags', 'busyState']),
        ipfsPortsRequested: state.externalProcState.getIn(['ipfs', 'portsRequested']),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
        syncActionId: state.externalProcState.getIn(['geth', 'syncActionId']),
        timestamp: state.appState.get('timestamp')
    };
}

export default connect(
    mapStateToProps,
    {
        gethGetSyncStatus,
        gethPauseSync,
        gethResumeSync,
        gethStart,
        gethStartLogger,
        gethStop,
        gethStopLogger,
        gethStopSync,
        ipfsStart,
        ipfsStop,
        saveGeneralSettings,
    },
    null,
    { pure: false }
)(Sync);
