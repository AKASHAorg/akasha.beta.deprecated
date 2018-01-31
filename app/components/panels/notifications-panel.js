import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Popover, Timeline, Switch } from 'antd';
import classNames from 'classnames';
import { DataLoader, Icon, NotificationLog } from '../';
import { hideNotificationsPanel } from '../../local-flux/actions/app-actions';
import { notificationsSubscribe } from '../../local-flux/actions/notifications-actions';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { profileMessages, generalMessages, settingsMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';
import { selectLoggedEthAddress } from '../../local-flux/selectors';

const { Item } = Timeline;

class NotificationsPanel extends Component {
    constructor (props) {
        super(props);
        const notificationsPreference = props.userSettings.get('notificationsPreference');
        this.state = {
            notifFeed: notificationsPreference.feed,
            notifComments: notificationsPreference.comments,
            notifDonations: notificationsPreference.donations,
            notifVotes: notificationsPreference.votes,
            visibleSettings: false
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { darkTheme, notifications, notificationsLoaded } = nextProps;
        const stateKeys = Object.keys(nextState);
        const stateChanged = stateKeys.some(key => nextState[key] !== this.state[key]);
        if (
            stateChanged ||
            darkTheme !== this.props.darkTheme ||
            !notifications.equals(this.props.notifications) ||
            notificationsLoaded !== this.props.notificationsLoaded
        ) {
            return true;
        }
        return false;
    }

    componentClickAway = () => {
        this.props.hideNotificationsPanel();
    };

    getContainerRef = (el) => { this.containerRef = el; };

    getUniqueKey = (notification) => {
        const values = Object.values(notification.payload);
        let key = notification.blockNumber;
        values.forEach((val) => {
            if (typeof val === 'string') {
                key = `${key}-${val.substr(0, 10)}`;
            }
        });
        return key;
    };

    handleVisibleChange = (visible) => {
        const { loggedEthAddress } = this.props;
        const notificationsPreference = {
            feed: this.state.notifFeed,
            donations: this.state.notifDonations,
            comments: this.state.notifComments,
            votes: this.state.notifVotes
        };
        this.setState({ visibleSettings: visible });
        if (!visible) {
            this.props.userSettingsSave(loggedEthAddress, { notificationsPreference });
            this.props.notificationsSubscribe(notificationsPreference);
        }
    };

    renderSettings = () => {
        const { intl } = this.props;
        const { notifComments, notifDonations, notifFeed, notifVotes } = this.state;

        return (
          <div className="notifications-panel__notif-pref-list">
            <div className="notifications-panel__notif-pref">
              {intl.formatMessage(profileMessages.followers)}
              <Switch
                size="small"
                checked={notifFeed}
                onChange={(checked) => {
                  this.setState({
                    notifFeed: checked
                  });
                  }
                }
              />
            </div>
            <div className="notifications-panel__notif-pref">
              {intl.formatMessage(generalMessages.comments)}
              <Switch
                size="small"
                checked={notifComments}
                onChange={(checked) => {
                  this.setState({
                    notifComments: checked
                  });
                }}
              />
            </div>
            <div className="notifications-panel__notif-pref">
              {intl.formatMessage(settingsMessages.votes)}
              <Switch
                size="small"
                checked={notifVotes}
                onChange={(checked) => {
                  this.setState({
                    notifVotes: checked
                  });
                  }
                }
              />
            </div>
            <div className="notifications-panel__notif-pref notifications-panel__notif-pref_last">
              {intl.formatMessage(settingsMessages.tips)}
              <Switch
                size="small"
                checked={notifDonations}
                onChange={(checked) => {
                  this.setState({
                    notifDonations: checked
                  });
                  }
                }
              />
            </div>
          </div>
        );
    }

    renderNotifications = () => {
        const { darkTheme, intl, notifications, notificationsLoaded } = this.props;
        const imgClass = classNames('notifications-panel__placeholder', {
            'notifications-panel__placeholder_dark': darkTheme
        });

        if (!notificationsLoaded) {
            return (
              <div className="notifications-panel__timeline-wrapper">
                <DataLoader flag />
              </div>
            );
        }

        return (
          <div className="notifications-panel__timeline-wrapper" ref={this.getContainerRef}>
            <Timeline>
              {notifications.map((notif) => {
                  if (!notif.blockNumber) {
                      return null;
                  }
                  return (
                    <Item
                      color="red"
                      key={this.getUniqueKey(notif)}
                    >
                      <NotificationLog
                        containerRef={this.containerRef}
                        key={notif.blockNumber}
                        notification={notif}
                      />
                    </Item>
                  );
              })}
            </Timeline>
            {!notifications.size &&
              <div className="flex-center notifications-panel__placeholder-wrapper">
                <div className={imgClass} />
                <div className="notifications-panel__placeholder-message">
                  {intl.formatMessage(profileMessages.noNotifications)}
                </div>
              </div>
            }
          </div>
        );
    };

    render () {
        const { intl } = this.props;

        return (
          <div className="notifications-panel">
            <div className="notifications-panel__header">
              <div className="notifications-panel__title">
                {intl.formatMessage(generalMessages.notifications)}
              </div>
              <div className="notifications-panel__more">
                <Popover
                  content={this.renderSettings()}
                  id="notifications-panel__settings-popover"
                  onVisibleChange={this.handleVisibleChange}
                  overlayClassName="notifications-panel__settings-popover"
                  placement="bottomRight"
                  title={
                    <div className="flex-center-y notifications-panel__popover-title">
                      {intl.formatMessage(settingsMessages.notificationsPreference)}
                    </div>
                  }
                  trigger="click"
                  visible={this.state.visibleSettings}
                >
                  <Icon
                    className="content-link notifications-panel__more-icon"
                    type="more"
                  />
                </Popover>
              </div>
            </div>
            {this.renderNotifications()}
          </div>
        );
    }
}

NotificationsPanel.propTypes = {
    darkTheme: PropTypes.bool,
    hideNotificationsPanel: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    notifications: PropTypes.shape().isRequired,
    notificationsLoaded: PropTypes.bool,
    notificationsSubscribe: PropTypes.func.isRequired,
    userSettings: PropTypes.shape().isRequired,
    userSettingsSave: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
        loggedEthAddress: selectLoggedEthAddress(state),
        notifications: state.notificationsState.get('allNotifications'),
        notificationsLoaded: state.notificationsState.get('notificationsLoaded'),
        userSettings: state.settingsState.get('userSettings')
    };
}

export default connect(
    mapStateToProps,
    {
        hideNotificationsPanel,
        notificationsSubscribe,
        userSettingsSave
    }
)(injectIntl(clickAway(NotificationsPanel)));
