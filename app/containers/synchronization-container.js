import { connect } from 'react-redux';
import {
    clearSyncStatus,
    gethGetSyncStatus,
    gethPauseSync,
    gethResumeSync,
    gethStart,
    /* gethStartLogger, */ gethStop,
    /* gethStopLogger, */ /* gethStopSync, */ ipfsGetPorts,
    ipfsStart,
    ipfsStop
} from '../local-flux/actions/external-process-actions';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';
import { Sync } from '../components';
import { externalProcessSelectors, settingsSelectors } from '../local-flux/selectors';

function mapStateToProps (state) {
    return {
        configurationSaved: settingsSelectors.getConfigurationSaved(state),
        gethBusyState: externalProcessSelectors.getGethBusyState(state),
        gethStarting: externalProcessSelectors.getGethStarting(state),
        gethStatus: externalProcessSelectors.selectGethStatus(state),
        gethStatusFetched: externalProcessSelectors.getGethStatusFetched(state),
        gethSyncStatus: externalProcessSelectors.selectGethSyncStatus(state),
        ipfsBusyState: externalProcessSelectors.getIpfsBusyState(state),
        ipfsPortsRequested: externalProcessSelectors.getIpfsPortsRequested(state),
        ipfsStatus: externalProcessSelectors.selectIpfsStatus(state),
        ipfsStatusFetched: externalProcessSelectors.getIpfsStatusFetched(state),
        syncActionId: externalProcessSelectors.selectGethSyncActionId(state)
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
        /* gethStartLogger, */
        gethStop,
        /* gethStopLogger, */
        /* gethStopSync, */
        ipfsGetPorts,
        ipfsStart,
        ipfsStop,
        saveGeneralSettings
    },
    null,
    { pure: false }
)(Sync);
