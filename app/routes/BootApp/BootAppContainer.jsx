import React from 'react';
import { CircularProgress, Paper, RaisedButton } from 'material-ui';
import NotificationPaper from './components/notification-paper';

class BootAppContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentDidMount () {
        this.context.router.push('setup');
    }
    render () {
        return (
          <div className="loader row">
            <div
              style={{ width: '100%', height: '100%' }}
              className="col-xs-12"
            >
              <CircularProgress
                style={{
                    paddingLeft: '50%',
                    marginLeft: '-25px',
                    marginTop: '22.5%'
                }}
                size={1.5}
              />
              <div
                className="col-xs-12 center-xs"
                style={{ marginTop: '25px' }}
              >
                Starting AKASHA
              </div>
            </div>
            <NotificationPaper
              message="A new version of AKASHA is available!"
              cancelable
              acceptLabel="Update"
              cancelLabel="Skip"
              onCancel={() => {}}
              onAccept={() => {}}
            />
            <NotificationPaper
              message="Geth is already started and it`s on main network!"
              messageDetails="Please close other applications that are using Geth and press RETRY"
              cancelable={false}
              isWarning
              acceptLabel="Retry"
              onCancel={() => {}}
              onAccept={() => {}}
            />
          </div>
        );
    }
}
BootAppContainer.propTypes = {};
BootAppContainer.contextTypes = {
    router: React.PropTypes.object
};
export default BootAppContainer;
