import React, { Component, PropTypes } from 'react';
import { Snackbar } from 'material-ui';
import { generalMessages, notificationMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions

class NotificationBar extends Component {
    getAutoHideDuration = (notification) => {
        if (notification && notification.get('duration')) {
            return notification.get('duration');
        }
        return null;
    };

    getActionLabel = (notification) => {
        const { intl } = this.props;
        const { palette } = this.context.muiTheme;
        if (notification && notification.get('duration')) {
            return null;
        }

        return (
          <span style={{ color: palette.accent2Color }}>
            {intl.formatMessage(generalMessages.ok)}
          </span>
        );
    };

    render () {
        const { hideNotification, intl, notifications } = this.props;
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
            style={{ maxWidth: '80%' }}
            bodyStyle={{ maxWidth: 'none' }}
            contentStyle={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                overflow: 'hidden'
            }}
            autoHideDuration={this.getAutoHideDuration(notifications.first())}
            action={this.getActionLabel(notifications.first())}
            onActionTouchTap={() => hideNotification(notifications.first())}
            message={message}
            open={!!notifications.first()}
            onRequestClose={() => hideNotification(notifications.first())}
          />
        );
    }
}

NotificationBar.propTypes = {
    hideNotification: PropTypes.func,
    intl: PropTypes.shape(),
    notifications: PropTypes.shape(),
};

NotificationBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default NotificationBar;
