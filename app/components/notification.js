import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification } from 'antd';
import { notificationMessages } from '../locale-data/messages';
import { hideNotification, notificationDisplay } from '../local-flux/actions/app-actions';


class Notification extends Component {
    componentWillReceiveProps (nextProps) {
        const { intl } = this.props;
        const { notifications, notificationsDisplay } = nextProps;
        if (this.props.notifications !== notifications) {
            const notif = notifications.last();
            if (notif && notificationsDisplay.indexOf(notif.get('displayId') === -1)) {
                const message = intl.formatMessage(
                    notificationMessages[notif.get('id')],
                    notif.get('values')
                );
                const close = () => {
                    this.props.hideNotification(notif);
                };
                notification.open({
                    message,
                    duration: 0,
                    onClose: close
                });
                this.props.notificationDisplay(notif);
            }
        }
    }
    render () {
        return null;
    }
}

Notification.propTypes = {
    hideNotification: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    notifications: PropTypes.shape().isRequired,
    notificationDisplay: PropTypes.func,
    notificationsDisplay: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        notifications: state.appState.get('notifications'),
        notificationsDisplay: state.appState.get('notificationsDisplay')
    };
}

export default connect(
    mapStateToProps,
    {
        notificationDisplay,
        hideNotification
    }
)(injectIntl(Notification));
