import React, { Component, PropTypes } from 'react';
import { RaisedButton } from 'material-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0 */
import PanelContainer from 'shared-components/PanelContainer/panel-container'; /* eslint import/no-unresolved: 0 */
import SetupHeader from '../../../components/setup-header';
import SyncStatusLoader from './sync-status';

class SyncStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            syncData: null,
            syncError: null,
            gethLogs: [],
            showGethLogs: false
        };
    }
    componentWillMount () {
        const { settingsActions } = this.props;
        settingsActions.getSettings('geth');
        settingsActions.getSettings('ipfs');
    }
    componentDidMount () {
        const { eProcActions, gethSettings, gethStatus } = this.props;
        if (!gethStatus.get('api') || !gethStatus.get('starting')) {
            eProcActions.startGeth(gethSettings);
        }
    }
    componentWillReceiveProps = (nextProps) => {
        const { gethStatus, eProcActions } = nextProps;
        if (gethStatus.get('api')) {
            console.log('ready to get sync status!');
            eProcActions.getSyncStatus();
        }
    }
    componentWillUpdate (nextProps) {
        const { gethStatus, configflags, gethSyncStatus } = nextProps;
        if (gethStatus.get('stopped') && configflags.requestStartupChange) {
            return this.context.router.push('setup');
        }
        if (gethSyncStatus.get('synced')) {
            return this.finishSync();
        }
        return null;
    }
    finishSync = () => {
        const { eProcActions } = this.props;
        eProcActions.finishSync();
        eProcActions.startIPFS();
        this.context.router.push('authenticate');
    };
    handleCancel = () => {
        const { eProcActions, settingsActions } = this.props;
        eProcActions.stopGeth();
        settingsActions.saveSettings('flags', { requestStartupChange: true });
    };
    _getActionLabels = () => {
        const { syncActionId, intl } = this.props;
        const labels = {};
        switch (syncActionId) {
            case 1:
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
                break;
            case 2:
                labels.title = intl.formatMessage(setupMessages.syncStopped);
                labels.action = intl.formatMessage(generalMessages.start);
                break;
            case 3:
                labels.title = intl.formatMessage(setupMessages.syncCompleted);
                labels.action = intl.formatMessage(generalMessages.completed);
                break;
            case 4:
                labels.title = intl.formatMessage(setupMessages.syncResuming);
                labels.action = intl.formatMessage(generalMessages.starting);
                break;
            default:
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
        }
        return labels;
    };
    _handleDetails = () => {
        const { loggerActions } = this.props;
        if (!this.state.showGethLogs) {
            return loggerActions.startGethLogger({ continuous: true }, (err, logs) => {
                if (err) return console.error(err);
                const logData = this.state.gethLogs.slice();
                if (logs.data.length > 1) {
                    logData.concat(logs.data);
                } else {
                    logData.unshift(logs.data['log-geth'][0]);
                }
                return this.setState({
                    showGethLogs: true,
                    gethLogs: logData.slice(0, 20)
                });
            });
        }
        return loggerActions.stopGethLogger(() => {
            this.setState({
                showGethLogs: false,
                gethLogs: []
            });
        });
    };
    render () {
        const {
            intl,
            gethStatus,
            gethSyncStatus,
            gethErrors } = this.props;

        const pageTitle = this._getActionLabels().title;
        let gethErrorCards;
        if (gethErrors.size > 0) {
            gethErrorCards = gethErrors.map((gethError, key) =>
              <div className="errorCard" key={key}>
                <div>{gethError.get('code')} {gethError.get('message')}</div>
              </div>
            );
        }
        return (
          <PanelContainer
            showBorder
            actions={[
            /* eslint-disable */
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                style={{ marginLeft: '12px' }}
                onClick={this.handleCancel}
              />,
              <RaisedButton
                key="pauseOrResume"
                label={this._getActionLabels().action}
                style={{ marginLeft: '12px' }}
                onClick={this.handleSync}
              />
            /* eslint-enable */
            ]}
            leftActions={[
            /* eslint-disable */
              <RaisedButton
                key="viewDetails"
                label={this.state.showGethLogs ? 'Hide details' : 'View details'}
                primary={this.state.showGethLogs}
                onClick={this._handleDetails}
              />
            /* eslint-enable */
            ]}
            header={<SetupHeader title="AKASHA" />}
          >
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
              {!gethErrorCards &&
                <SyncStatusLoader
                  gethStatus={gethStatus}
                  gethSyncStatus={gethSyncStatus}
                  intl={intl}
                />
              }
            </div>
            {this.state.showGethLogs &&
              <ul style={this.props.logListStyle} className="col-xs-12">
                {this.state.gethLogs.map((log, key) => (
                  <li
                    key={key}
                    style={{
                        marginBottom: '8px',
                        backgroundColor: (
                           log.level === 'warn' ?
                           'orange' : log.level === 'error' ?
                           'red' : 'transparent')
                    }}
                  >
                    <abbr title="Log Level">{log.level}</abbr>
                    <p>{log.message}</p>
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
    loggerActions: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    logListStyle: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    gethStatus: PropTypes.shape().isRequired,
    gethErrors: PropTypes.shape().isRequired,
    ipfsErrors: PropTypes.shape().isRequired,
    gethSyncStatus: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape(),
    syncActionId: PropTypes.number
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
        maxHeight: 330,
        overflowY: 'scroll',
        paddingLeft: 4,
        overflowX: 'hidden',
        fontFamily: 'Consolas',
        backgroundColor: 'rgba(0,0,0,0.02)'
    }
};
export default injectIntl(SyncStatus);
