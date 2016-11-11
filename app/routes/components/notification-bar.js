import React, { Component, PropTypes } from 'react';
import { Snackbar } from 'material-ui';

class NotificationBar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            notifications: this.props.appState.get('notifications')
        };
    }
    componentWillReceiveProps (nextProps) {
        const notifications = nextProps.appState.get('notifications'); // array (List)
        if (notifications.size > 0) {
            this.setState({
                notifications
            });
        }
    }
    _getAutoHideDuration = (notification) => {
        return null;
    }
    _getActionLabel = (notification) => {
        switch (notification && notification.type) {
            case 'alertHasPublishingDrafts':
                return 'View';
            case 'alertLoginRequired':
                return 'Confirm';
            default:
                return 'Show';
        }
    }
    _handleActionTouchTap = (ev, notification) => {
        ev.preventDefault();
        const { appActions } = this.props;
        switch (notification.type) {
            case 'alertHasPublishingDrafts':
                appActions.showPanel({ name: 'newEntry', overlay: true });
                return this._hideNotification('clickAway', notification);
            case 'alertLoginRequired':
                appActions.showAuthDialog();
                return this._hideNotification('clickAway', notification);
            default:
                return null;
        }
    }
    _hideNotification = (reason, notification) => {
        const notifications = this.state.notifications;
        console.log('hiding', notification);
        this.setState({
            notifications: notifications.delete(notifications.findIndex(notific =>
                notific.type === notification.type))
        });
    }

    render () {
        const { notifications } = this.state;
        return (
          <Snackbar
            style={{ maxWidth: 500 }}
            autoHideDuration={this._getAutoHideDuration(notifications.first())}
            action={this._getActionLabel(notifications.first())}
            onActionTouchTap={ev => this._handleActionTouchTap(ev, notifications.first())}
            message={notifications.first() ? notifications.first().get('message') : ''}
            open={!!notifications.first()}
            onRequestClose={reason => this._hideNotification(reason, notifications.first())}
          />
        );
    }
}

NotificationBar.propTypes = {
    appState: PropTypes.shape(),
    appActions: PropTypes.shape()
};

export default NotificationBar;
