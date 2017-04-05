import React, { Component, PropTypes } from 'react';
import { RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { generalMessages, setupMessages } from '../locale-data/messages';
import PanelContainerFooter from './PanelContainer/panel-container-footer';
import { SyncStatusLoader } from './';

class Sync extends Component {
    interval = null;

    componentDidMount () {
        const { gethStart, gethStatus, ipfsStart, ipfsStatus } = this.props;
        if (!gethStatus.get('spawned')) {
            gethStart();
        }
        if (!ipfsStatus.get('spawned')) {
            ipfsStart();
        }
    }

    componentWillReceiveProps (nextProps) {
        const { configurationSaved, gethStatus, gethGetSyncStatus, gethSyncStatus, history,
            ipfsStatus, syncActionId, ipfsPortsRequested } = nextProps;
        const gethSynced = gethSyncStatus.get('synced');
        const gethIsSyncing = gethStatus.get('api') && !gethSynced && (syncActionId === 1 ||
            syncActionId === 0);
        const ipfsSpawned = ipfsStatus.get('spawned');

        if (gethIsSyncing && !this.interval) {
            this.interval = setInterval(() => {
                if (syncActionId === 1) {
                    gethGetSyncStatus();
                }
            }, 2000);
        }
        if (gethSynced && ipfsSpawned && !ipfsPortsRequested) {
            history.push('authenticate');
        }
        if (!configurationSaved) {
            history.push('/');
        }
    }

    componentWillUnmount () {
        const { gethStopLogger } = this.props;
        gethStopLogger();
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    handleCancel = () => {
        const { gethStatus, gethStop, gethStopSync, ipfsStatus, ipfsStop,
            saveGeneralSettings } = this.props;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        gethStopSync();
        if (gethStatus.get('spawned')) {
            gethStop();
        }
        if (ipfsStatus.get('spawned')) {
            ipfsStop();
        }
        saveGeneralSettings({ configurationSaved: false });
    };

    handlePause = () => {
        const { gethPauseSync, gethResumeSync, gethStart, gethStop, ipfsStart, ipfsStatus,
            syncActionId } = this.props;

        switch (syncActionId) {
            case 1:
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                gethStop();
                gethPauseSync();
                break;
            case 2:
            case 3:
                gethStart();
                gethResumeSync();
                break;
            case 4:
                if (!ipfsStatus.get('spawned')) {
                    ipfsStart();
                }
                break;
            default:
                break;
        }
    };

    getActionLabels = () => {
        const { syncActionId, intl } = this.props;
        let title;
        let action;
        switch (syncActionId) {
            case 1:
                title = intl.formatMessage(setupMessages.synchronizing);
                action = intl.formatMessage(generalMessages.pause);
                break;
            case 2:
                title = intl.formatMessage(setupMessages.syncPaused);
                action = intl.formatMessage(generalMessages.resume);
                break;
            case 3:
                title = intl.formatMessage(setupMessages.syncStopped);
                action = intl.formatMessage(generalMessages.resume);
                break;
            case 4:
                title = intl.formatMessage(setupMessages.syncCompleted);
                action = intl.formatMessage(generalMessages.nextButtonLabel);
                break;
            default:
                title = intl.formatMessage(setupMessages.waitingForGeth);
                action = intl.formatMessage(generalMessages.pause);
        }
        return { title, action };
    };

    toggleGethLogs = () => {
        this.props.history.push('/log-details');
        // this.setState({
        //     showGethLogs: !this.state.showGethLogs
        // });
    };

    render () {
        const { gethBusyState, gethStarting, gethStatus,
            gethSyncStatus, intl, ipfsBusyState, ipfsPortsRequested, ipfsStatus,
            syncActionId } = this.props;
        return (
          <div style={{ flex: 1, padding: '0 24px' }}>
            <h1 style={{ fontWeight: '400' }} >
              {this.getActionLabels().title}
            </h1>
            <div>
              <p>
                {syncActionId === 4 ?
                    intl.formatMessage(setupMessages.afterSyncFinish) :
                    intl.formatMessage(setupMessages.onSyncStart)
                }
              </p>
            </div>
            <SyncStatusLoader
              gethStarting={gethStarting}
              gethStatus={gethStatus}
              gethSyncStatus={gethSyncStatus}
              intl={intl}
              ipfsStatus={ipfsStatus}
              syncActionId={syncActionId}
            />
            <PanelContainerFooter
              leftActions={
                <RaisedButton
                  key="viewDetails"
                  label={intl.formatMessage(setupMessages.viewDetails)}
                  onClick={this.toggleGethLogs}
                />
              }
            >
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                style={{ marginLeft: '12px' }}
                onClick={this.handleCancel}
                disabled={gethBusyState || (ipfsBusyState && syncActionId === 4)}
              />
              <RaisedButton
                key="pauseOrResume"
                label={this.getActionLabels().action}
                style={{ marginLeft: '12px' }}
                onClick={this.handlePause}
                disabled={gethBusyState
                    || ((ipfsBusyState || ipfsPortsRequested) && syncActionId === 4)}
                primary={syncActionId === 4}
              />
            </PanelContainerFooter>
          </div>
        );
    }
}

Sync.propTypes = {
    configurationSaved: PropTypes.bool,
    gethBusyState: PropTypes.bool,
    gethGetSyncStatus: PropTypes.func.isRequired,
    gethPauseSync: PropTypes.func.isRequired,
    gethResumeSync: PropTypes.func.isRequired,
    gethStart: PropTypes.func.isRequired,
    gethStarting: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    gethStop: PropTypes.func.isRequired,
    gethStopLogger: PropTypes.func.isRequired,
    gethStopSync: PropTypes.func.isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    history: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    ipfsBusyState: PropTypes.bool,
    ipfsPortsRequested: PropTypes.bool,
    ipfsStart: PropTypes.func.isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    ipfsStop: PropTypes.func.isRequired,
    saveGeneralSettings: PropTypes.func.isRequired,
    syncActionId: PropTypes.number,
};

Sync.contextTypes = {
    router: PropTypes.shape().isRequired
};

export default injectIntl(Sync);
