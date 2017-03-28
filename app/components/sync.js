import React, { Component, PropTypes } from 'react';
import { RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../locale-data/messages';
import { LogsList, PanelContainer, PanelHeader } from '../shared-components';
import { SyncStatusLoader } from './';

class Sync extends Component {
    state = {
        showGethLogs: false,
    };
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
        const { configurationSaved, gethStatus, gethGetSyncStatus, gethSyncStatus,
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
            this.context.router.push('authenticate');
        }
        if (!configurationSaved) {
            this.context.router.push('setup');
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
        const labels = {};
        switch (syncActionId) {
            case 1:
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
                break;
            case 2:
                labels.title = intl.formatMessage(setupMessages.syncPaused);
                labels.action = intl.formatMessage(generalMessages.resume);
                break;
            case 3:
                labels.title = intl.formatMessage(setupMessages.syncStopped);
                labels.action = intl.formatMessage(generalMessages.resume);
                break;
            case 4:
                labels.title = intl.formatMessage(setupMessages.syncCompleted);
                labels.action = intl.formatMessage(generalMessages.nextButtonLabel);
                break;
            default:
                labels.title = intl.formatMessage(setupMessages.waitingForGeth);
                labels.action = intl.formatMessage(generalMessages.pause);
        }
        return labels;
    };

    toggleGethLogs = () => {
        this.setState({
            showGethLogs: !this.state.showGethLogs
        });
    };

    render () {
        const { gethBusyState, gethLogs, gethStarting, gethStartLogger, gethStatus, gethStopLogger,
            gethSyncStatus, intl, ipfsBusyState, ipfsPortsRequested, ipfsStatus,
            syncActionId, timestamp } = this.props;

        return (
          <PanelContainer
            showBorder
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            actions={[
            /* eslint-disable */
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                style={{ marginLeft: '12px' }}
                onClick={this.handleCancel}
                disabled={gethBusyState || (ipfsBusyState && syncActionId === 4)}
              />,
              // this button has a dynamic label and behaviour, depending on the synchronization state (synchronizing, paused, stopped, synced)
              <RaisedButton
                key="pauseOrResume"
                label={this.getActionLabels().action}
                style={{ marginLeft: '12px' }}
                onClick={this.handlePause}
                disabled={gethBusyState
                    || ((ipfsBusyState || ipfsPortsRequested) && syncActionId === 4)}
                primary={syncActionId === 4}
              />
            /* eslint-enable */
            ]}
            leftActions={[
            /* eslint-disable */
              <RaisedButton
                key="viewDetails"
                label={this.state.showGethLogs ?
                    intl.formatMessage(setupMessages.hideDetails) :
                    intl.formatMessage(setupMessages.viewDetails)
                }
                primary={this.state.showGethLogs}
                onClick={this.toggleGethLogs}
              />
            /* eslint-enable */
            ]}
            header={<PanelHeader title={intl.formatMessage(generalMessages.akasha)} />}
          >
            {!this.state.showGethLogs &&
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
              </div>
            }
            {this.state.showGethLogs &&
              <LogsList
                logs={gethLogs}
                startLogger={gethStartLogger}
                stopLogger={gethStopLogger}
                timestamp={timestamp}
              />
            }
          </PanelContainer>
        );
    }
}

Sync.propTypes = {
    configurationSaved: PropTypes.bool,
    gethBusyState: PropTypes.bool,
    gethGetSyncStatus: PropTypes.func,
    gethLogs: PropTypes.shape().isRequired,
    gethPauseSync: PropTypes.func,
    gethResumeSync: PropTypes.func,
    gethStart: PropTypes.func,
    gethStarting: PropTypes.bool,
    gethStartLogger: PropTypes.func,
    gethStatus: PropTypes.shape().isRequired,
    gethStop: PropTypes.func,
    gethStopLogger: PropTypes.func,
    gethStopSync: PropTypes.func,
    gethSyncStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsBusyState: PropTypes.bool,
    ipfsPortsRequested: PropTypes.bool,
    ipfsStart: PropTypes.func,
    ipfsStatus: PropTypes.shape().isRequired,
    ipfsStop: PropTypes.func,
    saveGeneralSettings: PropTypes.func,
    syncActionId: PropTypes.number,
    timestamp: PropTypes.number,
};

Sync.contextTypes = {
    router: PropTypes.shape().isRequired
};

export default injectIntl(Sync);
