import { connect } from 'react-redux';
import { clearSyncStatus, gethGetSyncStatus, gethPauseSync, gethResumeSync, gethStart,
    gethStartLogger, gethStop, gethStopLogger, gethStopSync, ipfsGetPorts, ipfsStart,
    ipfsStop } from '../local-flux/actions/external-process-actions';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';
import { Sync } from '../components';
import { getConfigurationSaved } from '../local-flux/selectors/settings-selectors';
import { getGethBusyState, getGethStarting, selectGethStatus, getGethStatusFetched, selectGethSyncStatus,
    getIpfsBusyState, getIpfsPortsRequested, selectIpfsStatus, getIpfsStatusFetched,
    selectGethSyncActionId } from '../local-flux/selectors';

function mapStateToProps (state) {
    return {
        configurationSaved: getConfigurationSaved(state),
        gethBusyState: getGethBusyState(state),
        gethStarting: getGethStarting(state),
        gethStatus: selectGethStatus(state),
        gethStatusFetched: getGethStatusFetched(state),        
        gethSyncStatus: selectGethSyncStatus(state),
        ipfsBusyState: getIpfsBusyState(state),
        ipfsPortsRequested: getIpfsPortsRequested(state),
        ipfsStatus: selectIpfsStatus(state),
        ipfsStatusFetched: getIpfsStatusFetched(state),        
        syncActionId: selectGethSyncActionId(state),
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
