import React from 'react';
import { CircularProgress } from 'material-ui';
import NotificationPaper from './notification-paper';

class BootApp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            errors: null
        };
    }
    componentWillMount () {
        const { appActions } = this.props;
        appActions.checkForUpdates();
    }
    componentDidUpdate (prevProps) {
        const { appState } = prevProps;
        const hasUpdates = appState.getIn(['updates', 'hasUpdates']);
        if (!hasUpdates) {
            return this.context.router.push('setup');
        }
        return null;
    }
    render () {
        // @todo: manage app updates
        return (
          <div className="loader row">
            <div
              style={{ width: '100%', height: '100%' }}
              className="col-xs-12"
            >
              <CircularProgress
                style={{
                    paddingLeft: '50%',
                    marginLeft: '-40px',
                    marginTop: '22.5%'
                }}
                size={80}
                thickness={5}
              />
              <div
                className="col-xs-12 center-xs"
                style={{ marginTop: '25px' }}
              >
                Starting AKASHA
              </div>
            </div>
            {this.state.hasUpdates &&
              <NotificationPaper
                message="A new version of AKASHA is available!"
                acceptLabel="Update"
                cancelable={false}
                onAccept={() => {}}
              />
            }
          </div>
        );
    }
}
BootApp.propTypes = {
    appState: React.PropTypes.shape(),
    appActions: React.PropTypes.shape()
};
BootApp.contextTypes = {
    router: React.PropTypes.object
};
export default BootApp;
