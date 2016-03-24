import React, {Component, PropTypes} from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import RaisedButton from 'material-ui/lib/raised-button';
import LinearProgress from 'material-ui/lib/linear-progress';

class SyncStatus extends Component {
  
  constructor (props) {
    super(props);
    this.syncInterval = null;
  }
  
  componentDidMount () {
    this.startSync();
  }
  
  startSync = () => {
    const { actions } = this.props;
    this.syncInterval = setInterval(() => actions.getSyncStatus(), 500);
  };
  
  handleStop = () => {
    clearInterval(this.syncInterval);
  };
  
  handleStart = () => {
    
  };
  
  handleComplete = () => {
    
  };
  
  handleCancel = () => {
    
  };
  
  handlePause = () => {
    const { actions } = this.props;
    actions.getSyncStatus();
  };
  
  render () {
    const { style, syncState } = this.props;
    const buttonsStyle = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
    const message      = syncState.get('message');
    let blockSync, blockProgress, currentProgress;
    if (message.get) {
      if (!message.get(1)) {
        blockProgress = message.get(0);
        blockSync     = (
          <p>Finding peers: {blockProgress}</p>
        );
      } else {
        blockProgress   = message.get(1).toObject();
        currentProgress = ((blockProgress.currentBlock - blockProgress.startingBlock)
          / (blockProgress.highestBlock - blockProgress.startingBlock)) * 100;
        
        blockSync = (
          <LinearProgress mode="determinate"
                          color={'#000'}
                          value={currentProgress}/>
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
            <h1 style={{ fontWeight: '400' }}>{syncState.get('currentState')}</h1>
            <div>
              <p>
                {'Your machine is currently synchronizing with the Ethereum world computer network. You will be able' +
                ' to log in and enjoy the full AKASHA experience as soon as the sync is complete.'}
              </p>
              {blockSync}
            </div>
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
            <RaisedButton label="Pause"
                          style={{ marginLeft: '12px' }}
                          onClick={this.handleStop}
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
