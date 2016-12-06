import React, { Component, PropTypes } from 'react';
import { Snackbar } from 'material-ui';
import { injectIntl } from 'react-intl';
import { notificationMessages } from 'locale-data/messages';

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
        if (notification && notification.get('duration')) {
            return notification.get('duration');
        }
        return null;
    }
    _getActionLabel = (notification) => {
        const { palette } = this.context.muiTheme;
        let message;
        if (notification && notification.get('duration')) {
            return null;
        }
        switch (notification && notification.type) {
            case 'alertHasPublishingDrafts':
                message = 'View';
                break;
            case 'alertLoginRequired':
                message = 'Confirm';
                break;
            default:
                message = 'Dismiss';
                break;
        }
        return <span style={{ color: palette.accent2Color }}>{message}</span>;
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
                return this._hideNotification('clickAway', notification);
        }
    }
    _hideNotification = (reason, notification) => {
        const { appActions } = this.props;
        const notifications = this.state.notifications;
        this.setState({
            notifications: notifications.delete(notifications.findIndex(notific =>
                notific.id === notification.id))
        }, () => {
            appActions.hideNotification(notification);
        });
    }

    render () {
        const { intl } = this.props;
        const { notifications } = this.state;
        if (!notifications.size) {
            return null;
        }
        const message = notifications.first() ?
            intl.formatMessage(
                notificationMessages[notifications.first().get('id')],
                notifications.first().get('values')
            ) :
            '';
        return (
          <Snackbar
            style={{ maxWidth: 500 }}
            autoHideDuration={this._getAutoHideDuration(notifications.first())}
            action={this._getActionLabel(notifications.first())}
            onActionTouchTap={ev => this._handleActionTouchTap(ev, notifications.first())}
            message={message}
            open={!!notifications.first()}
            onRequestClose={reason => this._hideNotification(reason, notifications.first())}
          />
        );
    }
}

NotificationBar.propTypes = {
    appState: PropTypes.shape(),
    appActions: PropTypes.shape(),
    intl: PropTypes.shape()
};

NotificationBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default injectIntl(NotificationBar);
