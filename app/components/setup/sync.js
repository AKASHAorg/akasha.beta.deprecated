import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import { SyncStatusLoader } from '../';
import { LogsDetailsContainer } from '../../containers/';
import setupStyles from './setup.scss';

class Sync extends Component {
    interval = null;
    state = {
        showDetails: false
    };

    componentDidMount () {
        const { gethStart, gethStatus, ipfsStart, ipfsStatus } = this.props;
        if (!gethStatus.get('process')) {
            gethStart();
        }
        if (!ipfsStatus.get('process')) {
            ipfsStart();
        }
    }

    componentWillReceiveProps (nextProps) {
        const { gethStatus, gethGetSyncStatus, gethSyncStatus, syncActionId } = nextProps;
        const gethSynced = gethSyncStatus.get('synced');
        const gethIsSyncing = gethStatus.get('process') && !gethStatus.get('upgrading') &&
            !gethSynced && (syncActionId === 1 || syncActionId === 0);

        if (gethIsSyncing && !this.interval) {
            this.interval = setInterval(() => {
                if (syncActionId === 1) {
                    gethGetSyncStatus();
                }
            }, 2000);
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
        const { clearSyncStatus, gethStatus, gethStop, gethStopSync, ipfsStatus, ipfsStop,
            saveGeneralSettings } = this.props;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        gethStopSync();
        if (gethStatus.get('process')) {
            gethStop();
        }
        if (ipfsStatus.get('process')) {
            ipfsStop();
        }
        clearSyncStatus();
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
                if (!ipfsStatus.get('process')) {
                    ipfsStart();
                }
                break;
            default:
                break;
        }
    };

    toggleDetails = () => {
        this.setState({
            showDetails: !this.state.showDetails
        });
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

    render () {
        const { configurationSaved, gethBusyState, gethStarting, gethStatus,
            gethSyncStatus, intl, ipfsBusyState, ipfsPortsRequested, ipfsStatus,
            syncActionId } = this.props;
        const detailsButtonLabel = this.state.showDetails ?
            setupMessages.hideDetails :
            setupMessages.viewDetails;

        if (!configurationSaved) {
            return <Redirect to="/setup/configuration" />;
        } else if (gethSyncStatus.get('synced') && ipfsStatus.get('process') && !ipfsPortsRequested) {
            return <Redirect to="/setup/authenticate" />;
        }

        return (
          <div className={setupStyles.root}>
            <div className={`${setupStyles.column} ${setupStyles.leftColumn}`}>
              {!this.state.showDetails &&
                <div>Placeholder</div>
              }
              {this.state.showDetails &&
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto', padding: '20px 100px' }}>
                  <LogsDetailsContainer />
                </div>
              }
            </div>
            <div className={setupStyles.column} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center' }}>
                <SyncStatusLoader
                  gethStarting={gethStarting}
                  gethStatus={gethStatus}
                  gethSyncStatus={gethSyncStatus}
                  intl={intl}
                  ipfsStatus={ipfsStatus}
                  syncActionId={syncActionId}
                />
              </div>
              <div style={{ flex: '1 1 auto' }}>
                <div style={{ fontSize: '18px', fontWeight: '500' }} >
                  {this.getActionLabels().title}
                </div>
                <div>
                  <p>
                    {syncActionId === 4 ?
                        intl.formatMessage(setupMessages.afterSyncFinish) :
                        intl.formatMessage(setupMessages.onSyncStart)
                    }
                  </p>
                </div>
              </div>
              <div style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
                <RaisedButton
                  key="viewDetails"
                  label={intl.formatMessage(detailsButtonLabel)}
                  onClick={this.toggleDetails}
                />
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
              </div>
            </div>
          </div>
        );
    }
}

Sync.propTypes = {
    clearSyncStatus: PropTypes.func.isRequired,
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
    intl: PropTypes.shape().isRequired,
    ipfsBusyState: PropTypes.bool,
    ipfsPortsRequested: PropTypes.bool,
    ipfsStart: PropTypes.func.isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    ipfsStop: PropTypes.func.isRequired,
    saveGeneralSettings: PropTypes.func.isRequired,
    syncActionId: PropTypes.number,
};

export default injectIntl(Sync);
