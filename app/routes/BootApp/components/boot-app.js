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
        const { appState } = this.props;
        const hasUpdates = appState.getIn(['updates', 'hasUpdates']);
        if (!hasUpdates) {
            return this.context.router.push('setup');
        }
        return this.setState({
            hasUpdates
        });
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
    appState: React.PropTypes.shape()
};
BootApp.contextTypes = {
    router: React.PropTypes.object
};
export default BootApp;
