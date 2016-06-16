import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { RaisedButton } from 'material-ui';
import SyncProgress from '../ui/loaders/SyncProgress';
import { hashHistory } from 'react-router';
import { FormattedMessage, FormattedPlural, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../../locale-data/messages';

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
        const { eProcActions } = this.props;
        // start geth here!
        eProcActions.startGeth();
    }
    componentWillUnmount () {
        const { syncActions, loggerActions } = this.props;
        syncActions.stopSync();
        loggerActions.stopGethLogger();
    }
    getSyncStatus = () => {
        const { syncActions } = this.props;
        syncActions.startUpdateSync((err, updateData) => {
            const { success, status } = updateData;
            if (err) {
                return this.setState({
                    syncError: status
                });
            }
            if (success && status === 'empty') {
                // @TODO start ipfs first!
                this.finishSync();
            } else {
                this.setState({
                    syncData: status
                });
            }
        });
    }
    finishSync = () => {
        const { syncActions } = this.props;
        syncActions.stopUpdateSync(() => hashHistory.push('/authenticate'));
    }
    handleSync = () => {
        const { syncState, syncActions, setupActions, setupConfig } = this.props;
        if (syncState.get('actionId') === 1) {
            syncActions.stopSync();
            syncActions.stopUpdateSync();
            return setupActions.stopGeth();
        }
        setupActions.startGeth(setupConfig.get('geth').toJS());
        syncActions.startSync();
        return this.getSyncStatus();
    }
    handleCancel = () => {
        const { syncActions, setupActions } = this.props;
        syncActions.stopSync(() => {
            setupActions.stopGeth();
            this.context.router.push('setup-options');
        });
    }
    _getActionLabels = () => {
        const { syncState, intl } = this.props;
        const labels = {};
        switch (syncState.get('actionId')) {
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
    }
    _handleDetails = () => {
        const { loggerActions } = this.props;
        if (!this.state.showGethLogs) {
            return loggerActions.startGethLogger({ continuous: true }, (err, data) => {
                if (err) return console.log(err);
                const logData = this.state.gethLogs.slice();
                if (data.length > 1) {
                    logData.concat(data);
                } else {
                    logData.unshift(data.status['log-geth'][0]);
                }
                this.setState({
                    showGethLogs: true,
                    gethLogs: logData
                });
            });
        }
        loggerActions.stopGethLogger(() => {
            this.setState({
                showGethLogs: false,
                gethLogs: []
            });
        });
    }
    render () {
        const { style, intl } = this.props;
        const buttonsStyle = { padding: 0 };
        const message = this.state.syncData;
        let blockSync;
        let blockProgress;
        let currentProgress;
        let pageTitle;
        let progressBody;
        let peerInfo;
        pageTitle = this._getActionLabels().title;
        if (message && message.peerCount > 0 && message.highestBlock > 0) {
            blockProgress = message;
            currentProgress = ((blockProgress.currentBlock - blockProgress.startingBlock) /
                (blockProgress.highestBlock - blockProgress.startingBlock)) * 100;
            peerInfo = (
              <FormattedPlural
                value={message.peerCount}
                one={intl.formatMessage(setupMessages.onePeer)}
                few={intl.formatMessage(setupMessages.fewPeers)}
                many={intl.formatMessage(setupMessages.manyPeers)}
                other={intl.formatMessage(setupMessages.peers)}
              />
            );
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                {message.peerCount} {peerInfo} {`${intl.formatMessage(generalMessages.connected)}`}
                </div>
                <div style={{ fontSize: '20px' }} >
                  <strong style={{ fontWeight: 'bold' }} >
                     {blockProgress.currentBlock}
                  </strong>/
                    {blockProgress.highestBlock}
                </div>
              </div>
          );
        } else {
            peerInfo = intl.formatMessage(setupMessages.findingPeers);
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                  {peerInfo}
                </div>
              </div>
            );
        }
        blockSync = (
          <div style={{ padding: '64px 0', textAlign: 'center' }} >
            <SyncProgress value={currentProgress} />
              {progressBody}
          </div>
        );
        return (
          <div style={style}>
            <div className="start-xs" style={{ position: 'relative' }} >
              <div
                className="col-xs"
                style={{ flex: 1, padding: 0 }}
              >
                <LoginHeader />
                <h1 style={{ fontWeight: '400' }} >{pageTitle}</h1>
                <div>
                  <p>
                    <FormattedMessage {...setupMessages.onSyncStart} />
                  </p>
                </div>
                {blockSync}
              </div>
            </div>
            <div
              className="row"
              style={{ flex: 1 }}
            >
              <div className="col-xs-4 start-xs">
                <RaisedButton
                  label={this.state.showGethLogs ? 'Hide details' : 'View details'}
                  primary={this.state.showGethLogs}
                  onClick={this._handleDetails}
                />
              </div>
              <div
                className="col-xs-8 end-xs"
                style={buttonsStyle}
              >
                <RaisedButton
                  label={intl.formatMessage(generalMessages.cancel)}
                  style={{ marginLeft: '12px' }}
                  onClick={this.handleCancel}
                />
                <RaisedButton
                  label={this._getActionLabels().action}
                  style={{ marginLeft: '12px' }}
                  onClick={this.handleSync}
                />
              </div>
            </div>
            <ul style = {this.props.logListStyle}>
            {this.state.showGethLogs &&
                this.state.gethLogs.map((log, key) => (
                  <li key={key} style={{ marginBottom: '8px' }}>
                    <abbr title="Log Level">{log.level}</abbr>
                    <p>{log.message}</p>
                  </li>
                ))
            }
            </ul>
          </div>
        );
    }
}

SyncStatus.propTypes = {
    eProcActions: PropTypes.object.isRequired,
    syncActions: PropTypes.object.isRequired,
    setupActions: PropTypes.object.isRequired,
    loggerActions: PropTypes.object.isRequired,
    style: PropTypes.object,
    logListStyle: PropTypes.object,
    syncState: PropTypes.object.isRequired,
    intl: PropTypes.object,
    setupConfig: PropTypes.object.isRequired
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
