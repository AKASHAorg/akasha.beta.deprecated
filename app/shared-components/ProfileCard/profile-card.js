import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { FlatButton, IconButton, Paper, SvgIcon } from 'material-ui';
import NotificationsActiveIcon from 'material-ui/svg-icons/social/notifications-active';
import NotificationsDisabledIcon from 'material-ui/svg-icons/social/notifications-off';
import { Avatar } from '../';
import { UserDonate, UserMore } from '../svg';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { getInitials } from '../../utils/dataModule';

class ProfileCard extends Component {
    state = {
        actionsExpanded: false
    };

    shouldComponentUpdate (nextProps, nextState) {
        const { followPending, isFollower, isMuted,
            sendTipPending, loggedProfileData } = this.props;
        const { actionsExpanded } = this.state;
        if (followPending !== nextProps.followPending ||
            isMuted !== nextProps.isMuted ||
            sendTipPending !== nextProps.sendTipPending ||
            isFollower !== nextProps.isFollower ||
            !loggedProfileData.equals(nextProps.loggedProfileData) ||
            actionsExpanded !== nextState.actionsExpanded
        ) {
            return true;
        }
        return false;
    }

    selectProfile = () => {
        const { profileData, selectProfile } = this.props;
        selectProfile(profileData.profile);
    }

    openEditPanel = () => {
        const { showPanel } = this.props;
        showPanel({ name: 'editProfile', overlay: true });
    }

    sendTip = () => {
        const { profileData, sendTip } = this.props;
        sendTip(profileData);
    }

    toggleNotifications = () => {
        const { disableNotifFrom, enableNotifFrom, isMuted, profileData } = this.props;
        const { akashaId, profile } = profileData;
        if (isMuted) {
            enableNotifFrom(akashaId, profile);
        } else {
            disableNotifFrom(akashaId, profile);
        }
    };

    toggleMoreActions = () => {
        this.setState({
            actionsExpanded: !this.state.actionsExpanded
        }, () => ReactTooltip.rebuild());
    };

    renderHeaderActions = () => {
        const { intl, isFollower, isMuted, sendTipPending } = this.props;
        return (
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <IconButton
              onClick={this.toggleMoreActions}
              iconStyle={{ width: '20px', height: '20px' }}
              style={{ width: '32px', height: '32px', padding: '4px', marginBottom: '5px' }}
            >
              <SvgIcon viewBox="0 0 18 18">
                <UserMore />
              </SvgIcon>
            </IconButton>
            {this.state.actionsExpanded &&
              <div>
                <div
                  data-tip={sendTipPending ?
                      intl.formatMessage(profileMessages.sendingTip) :
                      intl.formatMessage(profileMessages.sendTip)
                  }
                >
                  <IconButton
                    onClick={this.sendTip}
                    disabled={sendTipPending}
                    iconStyle={{ width: '20px', height: '20px' }}
                    style={{ width: '32px', height: '32px', padding: '4px', margin: '5px 0' }}
                  >
                    <SvgIcon viewBox="0 0 18 18">
                      <UserDonate />
                    </SvgIcon>
                  </IconButton>
                </div>
                {isFollower &&
                  <div
                    data-tip={isMuted ?
                        intl.formatMessage(profileMessages.enableNotifications) :
                        intl.formatMessage(profileMessages.disableNotifications)
                    }
                  >
                    <IconButton
                      onClick={this.toggleNotifications}
                      iconStyle={{ width: '20px', height: '20px' }}
                      style={{ width: '32px', height: '32px', padding: '4px', margin: '5px 0' }}
                    >
                      <SvgIcon viewBox="0 0 18 18">
                        {isMuted ?
                          <NotificationsActiveIcon /> :
                          <NotificationsDisabledIcon />
                        }
                      </SvgIcon>
                    </IconButton>
                  </div>
                }
              </div>
            }
          </div>
        );
    };

    render () {
        const { followProfile, unfollowProfile, followPending, intl, isFollower,
            loggedProfileData, profileData } = this.props;
        if (!profileData) {
            return null;
        }
        const { avatar, akashaId, firstName, lastName, entriesCount, followersCount,
            followingCount, profile } = profileData;
        const isOwnProfile = akashaId === loggedProfileData.get('akashaId');
        const entriesCountMessage = (<FormattedMessage
          id="app.profile.entriesCount"
          description="counting a profile's entries"
          defaultMessage={`{entriesCount, number} {entriesCount, plural,
                one {entry}
                few {entries}
                many {entries}
                other {entries}
              }`}
          values={{ entriesCount }}
        />);
        const followersCountMessage = (<FormattedMessage
          id="app.profile.followersCount"
          description="counting a profile's followers"
          defaultMessage={`{followersCount, number} {followersCount, plural,
                one {follower}
                few {followers}
                many {followers}
                other {followers}
              }`}
          values={{ followersCount }}
        />);
        const followingCountMessage = (<FormattedMessage
          id="app.profile.followingCount"
          description="counting a profile's following"
          defaultMessage={`{followingCount, number} {followingCount, plural,
                one {following}
                few {following}
                many {following}
                other {following}
              }`}
          values={{ followingCount }}
        />);
        const titleStyle = {
            fontSize: '18px',
            fontWeight: '500',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            border: '0px',
            outline: 'none',
            background: 'transparent',
            width: '100%'
        };
        const actionsStyle = {
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0 10px'
        };
        const userInitials = getInitials(firstName, lastName);

        return (
          <Paper
            className="has-hidden-action"
            style={{
                position: 'relative',
                width: '214px',
                margin: '10px',
                display: 'flex',
                flexDirection: 'column'
            }}
          >
            {!isOwnProfile && this.renderHeaderActions()}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
              <button
                style={{
                    border: '0px', outline: 'none', background: 'transparent', borderRadius: '50%'
                }}
                onClick={this.selectProfile}
              >
                <Avatar
                  image={avatar}
                  radius={80}
                  userInitials={userInitials}
                  userInitialsStyle={{
                      textTransform: 'uppercase',
                      fontSize: '32px',
                      fontWeight: '600',
                      margin: '0px'
                  }}
                  style={{ marginRight: 0 }}
                />
              </button>
            </div>
            <div style={{ padding: '0 16px 8px', textAlign: 'center', flex: '1 1 auto' }}>
              <button
                style={titleStyle}
                title={akashaId}
                onClick={this.selectProfile}
              >
                {akashaId}
              </button>
              <div style={{ fontSize: '14px', fontWeight: '300' }}>
                {entriesCount !== null && <div>{entriesCountMessage}</div>}
                {followersCount !== null && <div>{followersCountMessage}</div>}
                {followingCount !== null && <div>{followingCountMessage}</div>}
              </div>
            </div>
            <div style={actionsStyle}>
              <FlatButton
                label={isOwnProfile ?
                    intl.formatMessage(generalMessages.edit) :
                    isFollower ?
                        intl.formatMessage(profileMessages.unfollow) :
                        intl.formatMessage(profileMessages.follow)
                }
                primary
                labelStyle={{ fontWeight: 400 }}
                onClick={() => isOwnProfile ?
                    this.openEditPanel() :
                    isFollower ?
                        unfollowProfile(akashaId, profile) :
                        followProfile(akashaId, profile)
                }
                disabled={followPending}
              />
            </div>
          </Paper>
        );
    }
}

ProfileCard.propTypes = {
    profileData: PropTypes.shape(),
    disableNotifFrom: PropTypes.func,
    enableNotifFrom: PropTypes.func,
    loggedProfileData: PropTypes.shape(),
    followProfile: PropTypes.func,
    unfollowProfile: PropTypes.func,
    followPending: PropTypes.bool,
    isFollower: PropTypes.bool,
    isMuted: PropTypes.bool,
    selectProfile: PropTypes.func.isRequired,
    sendTipPending: PropTypes.bool,
    sendTip: PropTypes.func.isRequired,
    showPanel: PropTypes.func.isRequired,
    intl: PropTypes.shape()
};

ProfileCard.contextTypes = {
    router: PropTypes.shape()
};

export default injectIntl(ProfileCard);
