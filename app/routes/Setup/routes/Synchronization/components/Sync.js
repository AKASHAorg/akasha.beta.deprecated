import React, { Component, PropTypes } from 'react';
import { RaisedButton, Paper, FlatButton } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0 */
import { hoursMinutesSeconds } from '../../../../../utils/dateFormatter';
import PanelContainer from 'shared-components/PanelContainer/panel-container'; /* eslint import/no-unresolved: 0 */
import SetupHeader from '../../../components/setup-header';
import SyncStatusLoader from './sync-status';

class SyncStatus extends Component {
    constructor (props) {
        super(props);
        this.logsTimestamp = null;
        this.state = {
            syncData: null,
            syncError: null,
            showGethLogs: false
        };
    }
    componentWillMount () {
        const { settingsActions, eProcActions } = this.props;
        settingsActions.getSettings('geth');
        settingsActions.getSettings('ipfs');
        eProcActions.getGethStatus();
    }
    componentDidMount () {
        const { eProcActions, gethStatus, ipfsStatus, gethSettings } = this.props;
        if (!gethStatus.get('spawned') && !gethStatus.get('startRequested')) {
            eProcActions.startGeth(gethSettings.toJS());
        }
        if (!ipfsStatus.get('started') && !ipfsStatus.get('startRequested')) {
            eProcActions.startIPFS();
        }
        this.logsTimestamp = new Date().getTime();
    }
    componentWillReceiveProps (nextProps) {
        const { gethStatus, eProcActions, gethSyncStatus, ipfsStatus,
            ipfsErrors, gethSettings, gethErrors, syncActionId } = nextProps;
        const gethSynced = gethSyncStatus.get('synced');
        const gethReadyToSync = gethStatus.get('api') && !gethSynced;
        const ipfsStarted = ipfsStatus.get('started');
        if (ipfsErrors.size === 0 && gethErrors.size === 0) {
            if (!ipfsStatus.get('started') && !ipfsStatus.get('startRequested')) {
                eProcActions.startIPFS();
            }
            if (!gethStatus.get('spawned') && !gethStatus.get('startRequested')
                    && syncActionId === 0) {
                eProcActions.startGeth(gethSettings.toJS());
            }
            if (gethReadyToSync) {
                if (syncActionId === 0) {
                    eProcActions.startSync();
                }
                if (syncActionId !== 2 && syncActionId !== 3) {
                    eProcActions.throttledSyncUpdate();
                }
            } else if (gethSynced && ipfsStarted) {
                this.context.router.push('authenticate');
            }
        }
    }
    componentWillUpdate (nextProps) {
        const { gethStatus, configFlags, gethBusyState } = nextProps;
        const shouldReconfigure = configFlags.get('requestStartupChange') && !gethStatus.get('api')
            && !gethBusyState;

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
    handleCancel = () => {
        const { eProcActions, settingsActions, syncActionId } = this.props;
        if (syncActionId !== 2) {
            eProcActions.stopSync();
            eProcActions.finishSync();
        }
        settingsActions.saveSettings('flags', { requestStartupChange: true });
    };
    handlePause = () => {
        const { syncActionId, eProcActions } = this.props;

        switch (syncActionId) {
            case 1:
                eProcActions.stopThrottledUpdate();
                eProcActions.pauseSync();
                break;
            case 2:
                eProcActions.resumeSync();
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
                labels.action = intl.formatMessage(generalMessages.pause);
                break;
            case 4:
                labels.title = intl.formatMessage(setupMessages.syncCompleted);
                labels.action = intl.formatMessage(generalMessages.completed);
                break;
            default:
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
        }
        return labels;
    };
    _handleDetails = () => {
        const { eProcActions } = this.props;
        if (!this.state.showGethLogs) {
            this.setState({
                showGethLogs: true
            });
            return eProcActions.startGethLogger(this.logsTimestamp);
        }

        this.setState({
            showGethLogs: false
        });
        return eProcActions.stopGethLogger();
    };
    handleRetry = () => {
        const { eProcActions } = this.props;
        return eProcActions.stopIPFS();
    };
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
            syncActionId } = this.props;

        const pageTitle = this._getActionLabels().title;
        let gethErrorCards;
        let ipfsErrorCards;

        if (gethErrors.size > 0) {
            gethErrorCards = gethErrors.map((gethError, key) =>
              <Paper key={key} style={{ margin: '10px 0', padding: '5px' }} >
                <span>
                  {gethError.get('code')}
                </span>
                <span style={{ marginLeft: '5px' }}>
                  {gethError.get('message')}
                </span>
              </Paper>
            );
        }
        if (ipfsErrors.size > 0) {
            ipfsErrorCards = ipfsErrors.map((ipfsError, key) =>
                <Paper key={key} style={{ margin: '10px 0', padding: '5px' }} >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 auto' }}>
                      <span>
                        {ipfsError.get('code')}
                      </span>
                      <span style={{ margin: '0 5px' }}>
                        {ipfsError.get('message')}
                      </span>
                    </div>
                    <FlatButton
                      style={{ flex: '0 0 auto' }}
                      label={intl.formatMessage(setupMessages.retry)}
                      onClick={this.handleRetry}
                    />
                  </div>
                </Paper>
            );
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
                disabled={gethBusyState}
              />,
              <RaisedButton
                key="pauseOrResume"
                label={this._getActionLabels().action}
                style={{ marginLeft: '12px' }}
                onClick={this.handlePause}
                disabled={gethBusyState}
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
            header={<SetupHeader title="AKASHA" />}
          >
            {!this.state.showGethLogs &&
              <div
                className="col-xs"
                style={{ flex: 1, padding: 0 }}
              >
                <h1 style={{ fontWeight: '400' }} >{pageTitle}</h1>
                <div>
                  <p>
                    <FormattedMessage {...setupMessages.onSyncStart} />
                  </p>
                </div>
                {gethErrorCards}
                {ipfsErrorCards}
                {!gethErrorCards && !ipfsErrorCards &&
                  <SyncStatusLoader
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
              <ul style={this.props.logListStyle} className="col-xs-12">
                {gethLogs.map((log, key) => (
                  <li key={key} style={{ marginBottom: '8px' }} >
                    <div style={{display: 'flex'}}>
                        <abbr
                            title="Log Level"
                            style={{
                                flex: '0 0 auto',
                                backgroundColor: (
                                    log.get('level') === 'warn' ?
                                    'orange' : log.get('level') === 'error' ?
                                    'red' : log.get('level') === 'info' ?
                                    'lightblue' : 'transparent')
                            }}
                        >
                            {log.get('level')}
                        </abbr>
                        <span style={{flex: '1 1 auto', textAlign: 'right'}}>
                            {hoursMinutesSeconds(new Date(log.get('timestamp')))}
                        </span>
                    </div>
                    <p style={{ marginTop: '7px' }}>{log.get('message')}</p>
                  </li>
                  ))
                  }
              </ul>
            }
          </PanelContainer>
        );
    }
}

SyncStatus.propTypes = {
    eProcActions: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    logListStyle: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    gethStatus: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    gethErrors: PropTypes.shape().isRequired,
    gethLogs: PropTypes.shape().isRequired,
    ipfsErrors: PropTypes.shape().isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape(),
    syncActionId: PropTypes.number,
    gethBusyState: PropTypes.bool
};

SyncStatus.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
};

SyncStatus.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    logListStyle: {
        paddingLeft: 4,
        fontFamily: 'Consolas',
        listStyle: 'none'
    }
};
export default injectIntl(SyncStatus);
