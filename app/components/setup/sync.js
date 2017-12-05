import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import { SyncStatus } from '../';
import { LogsDetailsContainer } from '../../containers/';

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

        if (gethSynced && !this.props.gethSyncStatus.get('syned')) {
            clearInterval(this.interval);
            this.interval = null;
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
        const { gethPauseSync, gethResumeSync, gethStart, gethStop, syncActionId } = this.props;

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
            default:
                break;
        }
    };

    handleNext = () => {
        const { ipfsStart, ipfsStatus } = this.props;
        if (!ipfsStatus.get('process')) {
            ipfsStart();
        }
    };

    toggleDetails = () => {
        this.setState({
            showDetails: !this.state.showDetails
        });
    };

    getActionLabels = () => {
        const { syncActionId, intl } = this.props;
        let action;
        let buttonIcon;
        switch (syncActionId) {
            case 1:
                action = intl.formatMessage(generalMessages.pause);
                buttonIcon = 'pause-circle-o';
                break;
            case 2:
            case 3:
                action = intl.formatMessage(generalMessages.resume);
                buttonIcon = 'play-circle-o';
                break;
            default:
                action = intl.formatMessage(generalMessages.pause);
                buttonIcon = 'pause-circle-o';
        }
        return { action, buttonIcon };
    };

    render () {
        const { configurationSaved, gethBusyState, gethStarting, gethStatus,
            gethSyncStatus, intl, ipfsBusyState, ipfsPortsRequested, ipfsStatus,
            syncActionId } = this.props;

        const { action, buttonIcon } = this.getActionLabels();
        if (!configurationSaved) {
            return <Redirect to="/setup/configuration" />;
        } else if (gethSyncStatus.get('synced') && ipfsStatus.get('process') && !ipfsPortsRequested) {
            return <Redirect to="/setup/authenticate" />;
        }

        return (
          <div className="setup-content sync">
            <div className="setup-content__column setup-pages_left">
              {!this.state.showDetails &&
                <div>Placeholder</div>
              }
              {this.state.showDetails &&
                <div className="sync__logs-container">
                  <LogsDetailsContainer />
                </div>
              }
            </div>
            <div className="setup-content__column setup-pages_right sync__content">
              <div className="sync__status-container">
                <SyncStatus
                  gethStarting={gethStarting}
                  gethStatus={gethStatus}
                  gethSyncStatus={gethSyncStatus}
                  intl={intl}
                  ipfsStatus={ipfsStatus}
                  syncActionId={syncActionId}
                />
              </div>
              <div className="flex-center sync__actions">
                {syncActionId !== 4 &&
                  <div className="flex-center-y">
                    <Button
                      className="sync__button"
                      onClick={this.toggleDetails}
                    >
                      <div className="flex-center-y">
                        <Icon className="sync__logs-icon" type="eye-o" />
                        <span>{intl.formatMessage(setupMessages.details)}</span>
                      </div>
                    </Button>
                    <Button
                      className="sync__button"
                      style={{ marginLeft: '12px' }}
                      onClick={this.handlePause}
                      disabled={gethBusyState}
                    >
                      <div className="flex-center-y lowercase">
                        <Icon className="sync__pause-icon" type={buttonIcon} />
                        <span>{action}</span>
                      </div>
                    </Button>
                    <Button
                      className="sync__button"
                      style={{ marginLeft: '12px' }}
                      onClick={this.handleCancel}
                      disabled={gethBusyState}
                    >
                      <div className="flex-center-y lowercase">
                        <div className="sync__stop-icon" />
                        <span>{intl.formatMessage(generalMessages.cancel)}</span>
                      </div>
                    </Button>
                  </div>
                }
                {syncActionId === 4 && !ipfsStatus.get('starting') &&
                  <Button
                    disabled={ipfsBusyState || ipfsPortsRequested}
                    onClick={this.handleNext}
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.next)}
                  </Button>
                }
              </div>
              <div className="sync__message">
                {syncActionId === 4 && !ipfsStatus.get('starting') ?
                    intl.formatMessage(setupMessages.afterSyncFinish) :
                    intl.formatMessage(setupMessages.onSyncStart)
                }
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
