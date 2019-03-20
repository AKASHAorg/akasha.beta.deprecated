import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification } from 'antd';
import * as types from '../../local-flux/constants';
import { notificationMessages } from '../../locale-data/messages';
import { hideNotification, notificationDisplay } from '../../local-flux/actions/app-actions';
import { highlightEditNotes } from '../../local-flux/actions/highlight-actions';
import { NotificationHighlightNote } from '../';
import { notificationSelectors } from '../../local-flux/selectors';

class Notification extends Component {
    componentWillReceiveProps (nextProps) {
        const { intl } = this.props;
        const { notifications, displayedNotifications } = nextProps;
        if (!this.props.notifications.equals(notifications)) {
            const notif = notifications.last();
            if (notif && displayedNotifications.indexOf(notif.get('displayId')) === -1) {
                if (!notif.get('type')) {
                    const message = intl.formatMessage(
                        notificationMessages[notif.get('id')],
                        notif.get('values')
                    );
                    const close = () => {
                        this.props.hideNotification(notif);
                    };
                    notification.open({
                        message,
                        className: 'notif',
                        duration: notif.get('duration'),
                        onClose: close
                    });
                    this.props.notificationDisplay(notif);
                } else if (notif.get('type') === types.HIGHLIGHT_SAVE_SUCCESS) {
                    const close = () => {
                        this.props.hideNotification(notif);
                    };
                    const key = `open${Date.now()}`;
                    const btnClose = () => {
                        notification.close(key);
                    };
                    notification.open({
                        message: (
                            <NotificationHighlightNote
                                notif={notif}
                                intl={intl}
                                editNote={this.props.highlightEditNotes}
                                btnClose={btnClose}
                            />
                        ),
                        key,
                        onClose: close,
                        className: 'notification-highlight'
                    });
                    this.props.notificationDisplay(notif);
                }
            }
        }
    }
    render () {
        return null;
    }
}

Notification.propTypes = {
    hideNotification: PropTypes.func,
    highlightEditNotes: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    notifications: PropTypes.shape().isRequired,
    notificationDisplay: PropTypes.func,
    displayedNotifications: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        notifications: notificationSelectors.selectNotifications(state)
        // displayedNotifications: notificationSelectors.selectDisplayedNotifications(state)
    };
}

export default connect(
    mapStateToProps,
    {
        highlightEditNotes,
        notificationDisplay,
        hideNotification
    }
)(injectIntl(Notification));
