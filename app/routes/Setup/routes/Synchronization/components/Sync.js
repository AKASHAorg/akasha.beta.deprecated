import React, { Component, PropTypes } from 'react';
import { RaisedButton, Paper, FlatButton } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0 */
import PanelContainer from 'shared-components/PanelContainer/panel-container'; /* eslint import/no-unresolved: 0 */
import { LogsList } from 'shared-components';
import PanelHeader from '../../../../components/panel-header';
import SyncStatusLoader from './sync-status';

class SyncStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showGethLogs: false,
            hasStartedGeth: false,
            hasStartedIpfs: false
        };
    }
    componentWillMount () {
        const { settingsActions, eProcActions } = this.props;
        settingsActions.getSettings('geth');
        settingsActions.getSettings('ipfs');
        eProcActions.getGethStatus();
        eProcActions.getIpfsStatus();
    }
    componentWillReceiveProps (nextProps) {
        const { gethStatus, eProcActions, gethSyncStatus, ipfsStatus, ipfsErrors, gethErrors,
            syncActionId, ipfsPortsRequested } = nextProps;
        const gethSynced = gethSyncStatus.get('synced');
        const gethReadyToSync = gethStatus.get('api') && !gethSynced;
        const ipfsSpawned = ipfsStatus.get('spawned');

        if (!this.state.hasStartedGeth && !nextProps.fetchingGethSettings
                && !gethStatus.get('spawned')) {
            this.startGeth();
        }
        if (!this.state.hasStartedIpfs && !nextProps.fetchingIpfsSettings
                && !ipfsStatus.get('spawned')) {
            this.startIpfs();
        }

        if (ipfsErrors.size === 0 && gethErrors.size === 0) {
            if (gethReadyToSync) {
                if (syncActionId === 0) {
                    eProcActions.startSync();
                }
                if (syncActionId !== 2 && syncActionId !== 3) {
                    eProcActions.throttledSyncUpdate();
                }
            } else if (gethSynced && ipfsSpawned && !ipfsPortsRequested) {
                this.context.router.push('authenticate');
            }
        }
    }
    componentWillUpdate (nextProps) {
        const { gethStatus, configFlags, gethBusyState, fetchingGethSettings } = nextProps;
        const shouldReconfigure = configFlags.get('requestStartupChange') && !gethStatus.get('spawned')
            && !gethBusyState && !fetchingGethSettings;

        if (shouldReconfigure) {
            return this.context.router.push('setup');
        }

        return null;
    }
    componentWillUnmount () {
        const { eProcActions } = this.props;
        eProcActions.stopGethLogger();
        eProcActions.stopThrottledUpdate();
    }
    startGeth () {
        const { gethStatus, gethSettings, eProcActions } = this.props;
        if (!gethStatus.get('spawned') && !gethStatus.get('startRequested')) {
            const options = gethSettings.toJS();
            if (options && options.ipcpath) {
                options.ipcpath = options.ipcpath.replace('\\\\.\\pipe\\', '');
            }
            eProcActions.startGeth(options);
            this.setState({
                hasStartedGeth: true
            });
        }
    }
    startIpfs () {
        const { ipfsStatus, eProcActions } = this.props;
        if (!ipfsStatus.get('started') && !ipfsStatus.get('startRequested')) {
            eProcActions.startIPFS();
            this.setState({
                hasStartedIpfs: true
            });
        }
    }
    handleCancel = () => {
        const { eProcActions, settingsActions, gethStatus, ipfsStatus } = this.props;
        if (gethStatus.get('spawned')) {
            eProcActions.stopSync();
            eProcActions.cancelSync();
        }
        if (ipfsStatus.get('spawned')) {
            eProcActions.stopIPFS();
        }
        settingsActions.saveSettings('flags', { requestStartupChange: true });
    };
    handlePause = () => {
        const { syncActionId, eProcActions, ipfsStatus } = this.props;

        switch (syncActionId) {
            case 0:
            case 1:
                eProcActions.stopThrottledUpdate();
                eProcActions.pauseSync();
                break;
            case 2:
            case 3:
                eProcActions.resumeSync();
                break;
            case 4:
                if (!ipfsStatus.get('spawned')) {
                    eProcActions.startIPFS();
                }
                break;
            default:
                break;
        }
    }
    _getActionLabels = () => {
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
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
        }
        return labels;
    };
    _handleDetails = () => {
        this.setState({
            showGethLogs: !this.state.showGethLogs
        });
    };
    handleRetry = () => {
        const { eProcActions } = this.props;
        return eProcActions.stopIPFS();
    };
    renderError (error, key) {
        return (<Paper key={key} style={{ margin: '10px 0', padding: '5px' }} >
          <span>
            {error.get('code')}
          </span>
          <span style={{ marginLeft: '5px' }}>
            {error.get('message')}
          </span>
        </Paper>);
    }
    render () {
        const {
            style,
            intl,
            gethStatus,
            gethSyncStatus,
            gethErrors,
            gethLogs,
            ipfsStatus,
            ipfsErrors,
            gethBusyState,
            ipfsBusyState,
            ipfsPortsRequested,
            syncActionId,
            eProcActions,
            gethStarting,
            timestamp
        } = this.props;

        const pageTitle = this._getActionLabels().title;
        let gethErrorCards;
        let ipfsErrorCards;

        if (gethErrors.size > 0) {
            gethErrorCards = gethErrors.map((gethError, key) => this.renderError(gethError, key));
        }
        if (ipfsErrors.size > 0) {
            ipfsErrorCards = ipfsErrors.map((ipfsError, key) => this.renderError(ipfsError, key));
        }

        return (
          <PanelContainer
            showBorder
            style={style}
            actions={[
            /* eslint-disable */
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                style={{ marginLeft: '12px' }}
                onClick={this.handleCancel}
                disabled={gethBusyState || (ipfsBusyState && syncActionId === 4)}
              />,
              <RaisedButton
                key="pauseOrResume"
                label={this._getActionLabels().action}
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
                label={this.state.showGethLogs ? intl.formatMessage(setupMessages.hideDetails) : intl.formatMessage(setupMessages.viewDetails)}
                primary={this.state.showGethLogs}
                onClick={this._handleDetails}
              />
            /* eslint-enable */
            ]}
            header={<PanelHeader title="AKASHA" />}
          >
            {!this.state.showGethLogs &&
              <div
                className="col-xs"
                style={{ flex: 1, padding: 0 }}
              >
                <h1 style={{ fontWeight: '400' }} >{pageTitle}</h1>
                <div>
                  <p>
                    {syncActionId === 4 ?
                      <FormattedMessage {...setupMessages.afterSyncFinish} /> :
                      <FormattedMessage {...setupMessages.onSyncStart} />
                    }
                  </p>
                </div>
                {gethErrorCards}
                {ipfsErrorCards}
                {!gethErrorCards && !ipfsErrorCards &&
                  <SyncStatusLoader
                    gethStarting={gethStarting}
                    gethStatus={gethStatus}
                    gethSyncStatus={gethSyncStatus}
                    ipfsStatus={ipfsStatus}
                    intl={intl}
                    syncActionId={syncActionId}
                  />
                }
              </div>
            }
            {this.state.showGethLogs &&
              <LogsList type="geth" eProcActions={eProcActions} timestamp={timestamp} logs={gethLogs} />
            }
          </PanelContainer>
        );
    }
}

SyncStatus.propTypes = {
    eProcActions: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    fetchingGethSettings: PropTypes.bool,
    fetchingIpfsSettings: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    gethErrors: PropTypes.shape().isRequired,
    gethStarting: PropTypes.bool,
    gethLogs: PropTypes.shape().isRequired,
    ipfsErrors: PropTypes.shape().isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape(),
    syncActionId: PropTypes.number,
    gethBusyState: PropTypes.bool,
    ipfsBusyState: PropTypes.bool,
    ipfsPortsRequested: PropTypes.bool,
    timestamp: PropTypes.number
};

SyncStatus.contextTypes = {
    muiTheme: React.PropTypes.shape().isRequired,
    router: React.PropTypes.shape().isRequired
};

SyncStatus.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
};
export default injectIntl(SyncStatus);
