// @flow strict
import * as React from 'react';
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
import { externalProcessSelectors, settingsSelectors } from '../local-flux/selectors';
import withRequest from '../components/high-order-components/with-request';
/* ::
    type StateProps = {|
        gethStatus: Object,
        gethSyncStatus: Object
    |}
    type OwnProps = {|
        active: boolean,
        getActionStatus: Function,
        dispatchAction: Function,
        web3: boolean,
        logger: Object
    |}
    type Props = {|
        ...StateProps,
        ...OwnProps,
    |}
*/

function Synchronization /* :: <AbstractComponent> */(props /* : Props */) {
    const { active, gethStatus, gethSyncStatus, getActionStatus, dispatchAction, web3 } = props;

    React.useEffect(() => {
        dispatchAction(gethStart(), getActionStatus(gethStart().type) === null);
    }, [!gethStatus.get('started')]);

    React.useEffect(() => {
        dispatchAction(gethGetSyncStatus(), state => {
            const gethSyncStatus = externalProcessSelectors.selectGethSyncStatus(state);
            /* dispatchAction only when: */
            return !gethSyncStatus.get('synced') && web3;
        });
    }, [!gethSyncStatus.get('synced')]);

    // if this component is active, render the layout
    // if it's not active, it will remain in background to check the status periodically

    if (active) {
        return <>Syncronizing!</>;
    }
    return null;
}

function mapStateToProps (state) {
    return {
        configurationSaved: settingsSelectors.getConfigurationSaved(state),
        gethStatus: externalProcessSelectors.selectGethStatus(state),
        gethSyncStatus: externalProcessSelectors.selectGethSyncStatus(state),
        ipfsStatus: externalProcessSelectors.selectIpfsStatus(state)
    };
}

export default connect/*:: <React.AbstractComponent<any>, Props, OwnProps, _, any, _ > */(mapStateToProps)(
    withRequest(Synchronization)
);
