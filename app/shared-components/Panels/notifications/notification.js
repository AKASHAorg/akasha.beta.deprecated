import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { ListItem, SvgIcon } from 'material-ui';
import NotificationsActiveIcon from 'material-ui/svg-icons/social/notifications-active';
import NotificationsDisabledIcon from 'material-ui/svg-icons/social/notifications-off';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Avatar } from '../../';
import { UserMore } from '../../svg';
import { getInitials } from '../../../utils/dataModule';

class Notification extends Component {
    state = {
        showActions: false
    };

    toggleShowActions = () => {
        this.setState({
            showActions: !this.state.showActions
        }, () => ReactTooltip.rebuild());
    };

    render () {
        const { deleteNotif, disableNotifications, enableNotifications,
            isMuted, isOwnNotif, message, navigateToProfile, profile } = this.props;
        const { showActions } = this.state;
        const { palette } = this.context.muiTheme;
        const initials = getInitials(profile.firstName, profile.lastName);
        let maxTextWidth = '100%';
        if (showActions) {
            maxTextWidth = isOwnNotif ? '320px' : '270px';
        }
        const iconStyle = {
            width: '32px',
            height: '32px',
            padding: '4px',
            marginLeft: '10px',
            color: palette.secondaryTextColor
        };
        return (
          <ListItem
            leftAvatar={
              <Avatar
                image={profile.avatar ? `${profile.baseUrl}/${profile.avatar}` : ''}
                size={40}
                userInitials={initials}
                userInitialsStyle={{
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    fontWeight: '600',
                    margin: '0px'
                }}
                onClick={() => navigateToProfile(profile.profile)}
              />
            }
            primaryText={
              <strong
                onClick={() => navigateToProfile(profile.profile)}
                style={{ color: palette.textColor }}
              >
                {profile.akashaId}
              </strong>
            }
            secondaryText={
              <div style={{ display: 'flex' }}>
                <div style={{ flex: '1 1 auto', maxWidth: maxTextWidth }}>
                  {message}
                </div>
              </div>
            }
            secondaryTextLines={2}
            className="has-hidden-action"
            rightIcon={
              <SvgIcon
                className={!showActions && 'hidden-action'}
                viewBox="0 0 18 18"
                onClick={this.toggleShowActions}
                style={{
                    height: '100%',
                    width: '42px',
                    padding: '0 9px',
                    margin: '0 2px',
                    color: palette.secondaryTextColor
                }}
              >
                <UserMore />
              </SvgIcon>
            }
          >
            {showActions &&
              <div style={{ position: 'absolute', top: 0, right: 48, bottom: 0, display: 'flex', alignItems: 'center' }}>
                {isMuted ?
                  !isOwnNotif &&
                    <NotificationsActiveIcon
                      className={!showActions && 'hidden-action'}
                      onClick={() => enableNotifications(profile.akashaId, profile.profile)}
                      style={iconStyle}
                    /> :
                  !isOwnNotif &&
                    <NotificationsDisabledIcon
                      className={!showActions && 'hidden-action'}
                      onClick={() => disableNotifications(profile.akashaId, profile.profile)}
                      style={iconStyle}
                    />
                }
                <ActionDelete
                  className={!showActions && 'hidden-action'}
                  style={iconStyle}
                  onClick={deleteNotif}
                />
              </div>
            }
          </ListItem>
        );
    }
}

Notification.contextTypes = {
    muiTheme: PropTypes.shape()
};

Notification.propTypes = {
    deleteNotif: PropTypes.func,
    disableNotifications: PropTypes.func,
    enableNotifications: PropTypes.func,
    isMuted: PropTypes.bool,
    isOwnNotif: PropTypes.bool,
    message: PropTypes.element,
    navigateToProfile: PropTypes.func,
    profile: PropTypes.shape(),
};

export default Notification;
