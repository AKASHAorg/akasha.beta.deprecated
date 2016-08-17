import React from 'react';
import { CircularProgress } from 'material-ui';
import NotificationPaper from './notification-paper';

class BootApp extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentWillMount () {
        const isGethRunning = this.props.externalProcState.getIn(['gethStatus', 'isRunning']);
        const gethNetwork = this.props.externalProcState.getIn(['gethStatus', 'network']);
        const hasUpdates = this.props.appState.getIn(['updates', 'hasUpdates']);
        if (!isGethRunning && !hasUpdates) {
            return this.context.router.push('setup');
        }
        if (isGethRunning) {
            this.setState({
                gethOnMain: (gethNetwork === 'main'),
                hasUpdates
            });
            if (gethNetwork !== 'main' && !hasUpdates) {
                this.context.router.push('setup');
            }
        }
        if (hasUpdates) {
           this.setState({
               hasUpdates
           });
        }
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
                {this.state.gethOnMain &&
                  <NotificationPaper
                    message="Geth is already started and it`s on main network!"
                    messageDetails="Please close other applications that are using Geth and press RETRY"
                    cancelable={false}
                    isWarning
                    acceptLabel="Retry"
                    onCancel={() => {}}
                    onAccept={() => {}}
                  />
                }
            </div>
        );
    }
}
BootApp.propTypes = {};
BootApp.contextTypes = {
    router: React.PropTypes.object
};
export default BootApp;
