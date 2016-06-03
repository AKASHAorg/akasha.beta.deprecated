import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { RaisedButton } from 'material-ui';
import SyncProgress from '../ui/loaders/SyncProgress';
import { hashHistory } from 'react-router';
import { FormattedMessage, FormattedPlural, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../../locale-data/messages';
import { updateSync, removeUpdateSync } from '../../services/setup-service';

class SyncStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            syncData: null,
            syncError: null,
            gethInstance: window.gethInstance,
            intervals: [],
            timeouts: []
        };
        this.getSyncStatus();
    }
    componentDidMount () {}
    componentDidUpdate () {
        // this.getSyncStatus();
    }
    getSyncStatus = () => {
        updateSync((err, updateData) => {
            const { success, status } = updateData;
            console.log('current status: ', status);
            if (err) {
                return this.setState({
                    syncError: status
                });
            }
            if (success && status === 'empty') {
                return removeUpdateSync(() => {
                    hashHistory.push('/authenticate');
                });
            }
            return this.setState({
                syncData: status
            });
        });
    }
    startSync = () => {}
    stopSync = () => {}
    resumeSync = () => {}
    finishSync = () => {}
    handleSync = () => {}
    handleCancel = () => {}
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
    render () {
        const { style, syncState, intl } = this.props;
        const buttonsStyle = { padding: 0 };
        // console.log(this.state.updateData);
        const message = this.state.syncData;
        let blockSync;
        let blockProgress;
        let currentProgress;
        let pageTitle;
        let progressBody;
        let peerInfo;
        pageTitle = this._getActionLabels().title;
        if (message && message[1]) {
            blockProgress = message[1];
            currentProgress = (blockProgress.currentBlock / blockProgress.highestBlock) * 100;
            peerInfo = (
                <FormattedPlural value={message[0]}
                  one = {intl.formatMessage(setupMessages.onePeer)}
                  few = {intl.formatMessage(setupMessages.fewPeers)}
                  many = {intl.formatMessage(setupMessages.manyPeers)}
                  other = {intl.formatMessage(setupMessages.peers)}
                />
            );
            progressBody = (
                <div>
                    <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                       {message[0]} {peerInfo} { `${intl.formatMessage(generalMessages.connected)}`}
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
        if (!this.state.syncData) {
            return (
            <div style={style}>
                <div className="start-xs" style = {{ position: 'relative' }}>
                    <div className="col-xs">
                        <LoginHeader />
                        <h1 style={{ fontWeight: '400' }} >
                            {intl.formatMessage(setupMessages.initializingTitle)}
                        </h1>
                        <p><FormattedMessage {...setupMessages.beforeSyncStart} /></p>
                    </div>
                </div>
            </div>
            );
        }
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
            <div className="end-xs"
              style={{ flex: 1 }}
            >
              <div className="col-xs"
                style={buttonsStyle}
              >
                <RaisedButton label={intl.formatMessage(generalMessages.cancel)}
                  style={{ marginLeft: '12px' }}
                  onClick={this.handleCancel}
                />
                <RaisedButton label={this._getActionLabels().action}
                  disabled={syncState.get('actionId') === 4}
                  style={{ marginLeft: '12px' }}
                  onClick={this.handleSync}
                />
              </div>
            </div>
          </div>
        );
    }
}

SyncStatus.propTypes = {
    actions: PropTypes.object.isRequired,
    style: PropTypes.object,
    syncState: PropTypes.object.isRequired
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
    }
};
export default injectIntl(SyncStatus);
