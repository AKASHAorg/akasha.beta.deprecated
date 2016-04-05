import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import RaisedButton from 'material-ui/lib/raised-button';
import SyncProgress from '../ui/loaders/SyncProgress';
import { hashHistory } from 'react-router';

class SyncStatus extends Component {

  componentDidMount() {
    const { actions, syncState } = this.props;
    const actionId = syncState.get('actionId');
    if (actionId === 2) {
      return actions.resumeSync();
    }
    return actions.startSync();
  }

  handleSync = () => {
    const { actions, syncState } = this.props;
    const actionId = syncState.get('actionId');
    if (actionId === 1) {
      return actions.stopSync();
    }

    if (actionId === 2) {
      return actions.resumeSync();
    }
  };

  handleCancel = () => {
    const { actions } = this.props;
    actions.stopSync();
    hashHistory.goBack();
  };

  render() {
    const { style, syncState } = this.props;
    const buttonsStyle = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
    const message = syncState.get('status');
    let blockSync, blockProgress, currentProgress, pageTitle, progressBody, peerInfo;
    pageTitle = syncState.get('currentState');
    if (message.get(1)) {
      blockProgress = message.get(1).toObject();
      currentProgress = ((blockProgress.currentBlock - blockProgress.startingBlock)
        / (blockProgress.highestBlock - blockProgress.startingBlock)) * 100;
      peerInfo = (message.get(0) !== 1) ? `${message.get(0)} peers`: '1 peer';
      progressBody = (
        <div>
          <div style={{fontWeight: 'bold', padding: '5px', fontSize: '16px'}}>
            {`${peerInfo} connected`}
          </div>
          <div style={{fontSize: '20px'}}>
            <span style={{fontWeight: 'bold'}}>
              {blockProgress.currentBlock}
            </span>/{blockProgress.highestBlock}
          </div>
        </div>
      );
    } else {
      peerInfo = 'Finding peers';
      progressBody = (
        <div>
          <div style={{fontWeight: 'bold', padding: '5px', fontSize: '16px'}}>{peerInfo}</div>
        </div>
      );
    }
    blockSync = (
      <div style={{paddingTop: '30px', textAlign: 'center', height: '250px'}}>
        <SyncProgress value={currentProgress}/>
        {progressBody}
      </div>
    );
    return (
      <div style={style}>
        <div className="start-xs">
          <div
            className="col-xs"
            style={{ flex: 1, padding: 0 }}
          >
            <LoginHeader />
            <h1 style={{ fontWeight: '400' }}>{pageTitle}</h1>
            <div>
              <p>
                {'Your machine is currently synchronizing with the Ethereum world computer' +
                ' network. You will be able to log in and enjoy the full AKASHA experience as' +
                ' soon as the sync is complete.'}
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
            <RaisedButton label="Cancel"
                          style={{ marginLeft: '12px' }}
                          onClick={this.handleCancel}
            />
            <RaisedButton label={syncState.get('action')}
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
  muiTheme: React.PropTypes.object
};

SyncStatus.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};
export default SyncStatus;
