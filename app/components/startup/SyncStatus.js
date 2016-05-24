import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { RaisedButton } from 'material-ui';
import SyncProgress from '../ui/loaders/SyncProgress';
import { hashHistory } from 'react-router';
import { FormattedMessage, FormattedPlural, injectIntl } from 'react-intl';
import {setupMessages, generalMessages} from '../../locale-data/messages';


class SyncStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      syncData: null,
      gethInstance: window.gethInstance,
      intervals: [],
      timeouts: []
    };
  }
  componentDidMount () {
    const { actions, syncState } = this.props;
    const actionId = syncState.get('actionId');
    if (actionId === 2) {
      return this.resumeSync();
    }
    return this.startSync();
  }
  getSyncStatus = () => {
    return this.state.gethInstance.inSync().then((data) => {
      if (!data) {
        this.clearInterval();
        this.props.actions.finishSync();
        return this.finishSync();
      }
      return this.setState({
        syncData: data
      });
    }).catch((reason) => {
      console.error(reason, reason.stack);
    });
  }
  startSync = () => {
    if (this.state.intervals.length > 0) {
      this.clearInterval();
    }
    this.props.actions.startSync();
    this.setInterval(() => this.getSyncStatus(), 500);
  }
  stopSync = () => {
    this.state.gethInstance.stop();
    this.clearInterval ();
    this.clearTimeout();
  }
  resumeSync = () => {
    this.state.gethInstance.start().then(() => {
      this.setTimeout(() => this.startSync(), 4000);
    });
  }
  finishSync = () => {
    return this.props.actions.finishSync();
  }

  // those should be moved in a decorator
  setInterval() {
    this.state.intervals.push(setInterval.apply(null, arguments));
  }
  clearInterval () {
    let intervals = this.state.intervals;
    for (let i = intervals.length - 1; i >= 0; i--) {
      clearInterval(intervals[i])
    }
  }
  setTimeout () {
    this.state.timeouts.push(setTimeout.apply(null, arguments));
  }
  clearTimeout () {
    let timeouts = this.state.timeouts;
    for (var i = timeouts.length - 1; i >= 0; i--) {
      clearTimeout(timeouts[i]);
    }
  }
  handleSync = () => {
    const { actions, syncState } = this.props;
    const actionId = syncState.get('actionId');
    if (actionId === 1) {
      this.stopSync();
      this.props.actions.stopSync();
    }

    if (actionId === 2) {
      this.resumeSync();
      this.props.actions.resumeSync();
    }
  };

  handleCancel = () => {
    const { actions } = this.props;
    this.props.actions.stopSync();
    this.stopSync();
    hashHistory.goBack();
  };
  componentWillUnmount () {
    this.clearInterval();
    this.clearTimeout();
  };
  render () {
    const { style, syncState, intl } = this.props;
    const buttonsStyle = { padding: 0 };
    const message = this.state.syncData;
    let blockSync, blockProgress, currentProgress, pageTitle, progressBody, peerInfo;
    pageTitle = this._getActionLabels().title;
    if (message && message[1]) {
      blockProgress = message[1];
      currentProgress = (blockProgress.currentBlock / blockProgress.highestBlock) * 100;
      peerInfo = <FormattedPlural value={message[0]}
                        one = {intl.formatMessage(setupMessages.onePeer)}
                        few = {intl.formatMessage(setupMessages.fewPeers)}
                        many = {intl.formatMessage(setupMessages.manyPeers)}
                        other = {intl.formatMessage(setupMessages.peers)}
                  />;
      progressBody = (
        <div>
          <div style={{fontWeight: 'bold', padding: '5px', fontSize: '16px'}} >{message[0]} {peerInfo} { `${intl.formatMessage(generalMessages.connected)}`}</div>
          <div style={{fontSize: '20px'}} >
            <strong style={{fontWeight: 'bold'}} >{blockProgress.currentBlock}</strong>/
            {blockProgress.highestBlock}
          </div>
        </div>
      );
    } else {
      peerInfo = intl.formatMessage(setupMessages.findingPeers);
      progressBody = (
        <div>
          <div style={{fontWeight: 'bold', padding: '5px', fontSize: '16px'}} >{peerInfo}</div>
        </div>
      );
    }
    blockSync = (
      <div style={{padding: '64px 0', textAlign: 'center'}} >
        <SyncProgress value={currentProgress} />
        {progressBody}
      </div>
    );
    if(!this.state.syncData) {
      return (
        <div style={style}>
          <div className="start-xs" style = {{position: 'relative'}}>
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
        <div className="start-xs" style={{position: 'relative'}} >
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
  _getActionLabels = () => {
    const { syncState, intl } = this.props;
    const labels = {}
    switch(syncState.get('actionId')) {
      case 1:
        labels['title'] = intl.formatMessage(setupMessages.synchronizing);
        labels['action'] = intl.formatMessage(generalMessages.pause);
        break;
      case 2:
        labels['title'] = intl.formatMessage(setupMessages.syncStopped);
        labels['action'] = intl.formatMessage(generalMessages.start);
        break;
      case 3:
        labels['title'] = intl.formatMessage(setupMessages.syncCompleted);
        labels['action'] = intl.formatMessage(generalMessages.completed);
        break;
      case 4:
        labels['title'] = intl.formatMessage(setupMessages.syncResuming);
        labels['action'] = intl.formatMessage(generalMessages.starting);
        break;
      default:
        labels['title'] = intl.formatMessage(setupMessages.synchronizing);
        labels['action'] = intl.formatMessage(generalMessages.pause);
    }
    return labels;
  }
}

SyncStatus.propTypes = {
  actions: PropTypes.object.isRequired,
  style: PropTypes.object,
  syncState: PropTypes.object.isRequired
};

SyncStatus.contextTypes = {
  muiTheme: React.PropTypes.object
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
