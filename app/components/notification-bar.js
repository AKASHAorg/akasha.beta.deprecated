import React, { Component, PropTypes } from 'react';
import { Snackbar } from 'material-ui';
import { generalMessages, notificationMessages } from '../locale-data/messages';

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
        const { hideNotification, intl, notification } = this.props;
        const message = intl.formatMessage(
            notificationMessages[notification.get('id')],
            notification.get('values')
        );
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
            autoHideDuration={this.getAutoHideDuration(notification)}
            action={this.getActionLabel(notification)}
            onActionTouchTap={() => hideNotification(notification)}
            message={message}
            open={!!notification}
            onRequestClose={() => hideNotification(notification)}
          />
        );
    }
}

NotificationBar.propTypes = {
    hideNotification: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    notification: PropTypes.shape().isRequired,
};

NotificationBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default NotificationBar;
