import React, {Component, PropTypes} from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import RaisedButton from 'material-ui/lib/raised-button';
import LinearProgress from 'material-ui/lib/linear-progress';
import {hashHistory} from 'react-router';

class SyncStatus extends Component {

  constructor (props) {
    super(props);
    this.syncInterval = null;
  }

  componentDidMount () {
    const {actions, syncState } = this.props;
    const actionId = syncState.get('actionId');
    if (actionId === 2) {
      return actions.resumeSync();
    }
    return actions.startSync();
  }

  handleSync = () => {
    const {actions, syncState } = this.props;
    const actionId = syncState.get('actionId');
    if (actionId === 1) {
      return actions.stopSync();
    }

    if (actionId === 2) {
      return actions.resumeSync();
    }
  };

  handleCancel = () => {
    const {actions} = this.props;
    actions.stopSync();
    hashHistory.goBack();
  };

  render () {
    const { style, syncState } = this.props;
    const buttonsStyle = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
    const message      = syncState.get('status');
    let blockSync, blockProgress, currentProgress, pageTitle;
    pageTitle          = syncState.get('currentState');

    if (message.get) {
      if (!message.get(1)) {
        blockProgress = message.get(0);
        blockSync     = (
          <div style={{paddingTop: '30px'}}><p>Finding peers: <b>{blockProgress}</b></p></div>
        );
      } else {
        blockProgress   = message.get(1).toObject();
        currentProgress = ((blockProgress.currentBlock - blockProgress.startingBlock)
          / (blockProgress.highestBlock - blockProgress.startingBlock)) * 100;

        blockSync = (
          <div style={{paddingTop: '30px'}}>
            <LinearProgress mode="determinate"
                            color={'#000'}
                            value={currentProgress}/>
            <p>
              <span>peers: <b>{message.get(0)}</b></span>
              <span
                style={{float: 'right', fontStyle: 'italic'}}>block: <b>{blockProgress.currentBlock}</b>/{blockProgress.highestBlock}</span>
            </p>
          </div>
        );
      }
    }
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
                {'Your machine is currently synchronizing with the Ethereum world computer network. You will be able' +
                ' to log in and enjoy the full AKASHA experience as soon as the sync is complete.'}
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
  actions:   PropTypes.object.isRequired,
  style:     PropTypes.object,
  syncState: PropTypes.object.isRequired
};

SyncStatus.contextTypes = {
  muiTheme: React.PropTypes.object
};

SyncStatus.defaultProps = {
  style: {
    width:         '100%',
    height:        '100%',
    display:       'flex',
    flexDirection: 'column',
    position:      'relative'
  }
};
export default SyncStatus;
