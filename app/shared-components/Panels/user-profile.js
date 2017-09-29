import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { colors } from 'material-ui/styles';
import { Paper, Tabs, Tab, List } from 'material-ui';
import { Avatar } from '../';
import { getInitials } from '../../utils/dataModule';
import UserProfileHeader from './user-profile/user-profile-header';
import { CommentNotification, EntryNotification, FollowNotification, MentionNotification,
    TipNotification, VoteNotification } from './notifications';

const tabStyles = {
    default_tab: {
        color: colors.grey500,
        fontWeight: 400,
    },
    active_tab: {
        color: colors.deepOrange700,
    }
};
const selectedStyle = {
    position: 'fixed',
    top: '296px',
    width: '480px',
    bottom: '0px',
    overflow: 'auto'
};
const [FEED_SELECTED, YOU_SELECTED, MESSAGES_SELECTED] = [1, 2, 3];
const eventTypes = {
    VOTE: 'vote',
    COMMENT: 'comment',
    PUBLISH: 'publish',
    FOLLOWING: 'following',
    GOT_TIPPED: 'gotTipped',
    ENTRY_MENTION: 'entryMention',
    COMMENT_MENTION: 'commentMention'
};
class UserProfilePanel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: FEED_SELECTED
        };
    }

    componentDidMount () {
        this.readSubscriptionNotif();
    }

    getStyle = (identity) => {
        if (identity === this.state.selected) {
            return selectedStyle;
        }
        return {};
    };

    readSubscriptionNotif = () => {
        const { notificationsActions } = this.props;
        notificationsActions.readFeedNotif();
    };

    readYouNotif = (number) => {
        const { notificationsActions } = this.props;
        notificationsActions.readYouNotif(number);
    };

    navigateToTag = (tag) => {
        const { hidePanel, params } = this.props;
        hidePanel();
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
    };

    navigateToProfile = (profileAddress) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        this.props.hidePanel();
        router.push(`/${loggedAkashaId}/profile/${profileAddress}`);
    };

    navigateToEntry = (entryId) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        this.props.hidePanel();
        router.push(`/${loggedAkashaId}/entry/${entryId}`);
    };

    isMuted = (profileAddress) => {
        const { mutedList } = this.props;
        return mutedList && mutedList.indexOf(profileAddress) !== -1;
    }

    _renderFollower (event, index) {
        const { notificationsActions, settingsActions } = this.props;
        return (
          <FollowNotification
            blockNumber={event.blockNumber}
            deleteNotif={notificationsActions.deleteYouNotif}
            disableNotifications={settingsActions.disableNotifFrom}
            enableNotifications={settingsActions.enableNotifFrom}
            index={index}
            isMuted={this.isMuted(event.follower.profile)}
            navigateToProfile={this.navigateToProfile}
            profile={event.follower}
            key={eventTypes.FOLLOWING + index + event.blockNumber}
          />
        );
    }

    _renderEntry (event, index) {
        const { loggedProfileData, notificationsActions, settingsActions } = this.props;
        const isOwnNotif = loggedProfileData.get('profile') === event.profileAddress;
        const deleteNotif = isOwnNotif ?
            notificationsActions.deleteYouNotif :
            notificationsActions.deleteFeedNotif;

        if (!event.entry.content) {
            return null;
        }

        return (
          <EntryNotification
            blockNumber={event.blockNumber}
            deleteNotif={deleteNotif}
            disableNotifications={settingsActions.disableNotifFrom}
            enableNotifications={settingsActions.enableNotifFrom}
            entry={event.entry}
            index={index}
            isMuted={this.isMuted(event.author.profile)}
            isOwnNotif={isOwnNotif}
            navigateToEntry={this.navigateToEntry}
            navigateToProfile={this.navigateToProfile}
            navigateToTag={this.navigateToTag}
            profile={event.author}
            tags={event.tag}
            key={eventTypes.PUBLISH + index + event.blockNumber}
          />
        );
    }

    _renderComment (event, index) {
        const { loggedProfileData, notificationsActions, settingsActions } = this.props;
        const isOwnNotif = loggedProfileData.get('profile') === event.profileAddress;
        const deleteNotif = isOwnNotif ?
            notificationsActions.deleteYouNotif :
            notificationsActions.deleteFeedNotif;

        if (!event.entry.content) {
            return null;
        }

        return (
          <CommentNotification
            blockNumber={event.blockNumber}
            deleteNotif={deleteNotif}
            disableNotifications={settingsActions.disableNotifFrom}
            enableNotifications={settingsActions.enableNotifFrom}
            index={index}
            isMuted={this.isMuted(event.author.profile)}
            isOwnNotif={isOwnNotif}
            navigateToEntry={this.navigateToEntry}
            navigateToProfile={this.navigateToProfile}
            profile={event.author}
            entry={event.entry}
            key={eventTypes.COMMENT + index + event.blockNumber}
          />
        );
    }

    _renderVote (event, index) {
        const { loggedProfileData, notificationsActions, settingsActions } = this.props;
        const isOwnNotif = loggedProfileData.get('profile') === event.profileAddress;
        const deleteNotif = isOwnNotif ?
            notificationsActions.deleteYouNotif :
            notificationsActions.deleteFeedNotif;
        if (!event.entry.content) {
            return null;
        }

        return (
          <VoteNotification
            blockNumber={event.blockNumber}
            deleteNotif={deleteNotif}
            disableNotifications={settingsActions.disableNotifFrom}
            enableNotifications={settingsActions.enableNotifFrom}
            entry={event.entry}
            index={index}
            isMuted={this.isMuted(event.author.profile)}
            isOwnNotif={isOwnNotif}
            navigateToEntry={this.navigateToEntry}
            navigateToProfile={this.navigateToProfile}
            profile={event.author}
            weight={event.weight}
            key={eventTypes.VOTE + index + event.blockNumber}
          />
        );
    }

    _renderTip (event, index) {
        const { notificationsActions, settingsActions } = this.props;
        return (
          <TipNotification
            blockNumber={event.blockNumber}
            deleteNotif={notificationsActions.deleteYouNotif}
            disableNotifications={settingsActions.disableNotifFrom}
            enableNotifications={settingsActions.enableNotifFrom}
            index={index}
            isMuted={this.isMuted(event.profile.profile)}
            navigateToProfile={this.navigateToProfile}
            profile={event.profile}
            value={event.value}
            key={eventTypes.GOT_TIPPED + index + event.blockNumber}
          />
        );
    }

    _renderMention (event, index) {
        const { intl, loggedProfileData, notificationsActions, settingsActions } = this.props;
        if (!event.entry.content) {
            return null;
        }
        const isOwnNotif = loggedProfileData.get('profile') === event.profileAddress;

        return (
          <MentionNotification
            deleteNotif={notificationsActions.deleteYouNotif}
            disableNotifications={settingsActions.disableNotifFrom}
            enableNotifications={settingsActions.enableNotifFrom}
            entry={event.entry}
            index={index}
            intl={intl}
            isMuted={this.isMuted(event.author.profile)}
            isOwnNotif={isOwnNotif}
            navigateToEntry={this.navigateToEntry}
            navigateToProfile={this.navigateToProfile}
            profile={event.author}
            timestamp={event.timeStamp}
            type={event.type}
            key={event.type + index + event.timeStamp}
          />
        );
    }

    renderAvatar (profileData) {
        const initials = getInitials(profileData.firstName, profileData.lastName);
        return (
          <button
            style={{
                border: '0px', outline: 'none', background: 'transparent', borderRadius: '50%'
            }}
            onClick={() => this.navigateToProfile(profileData.profile)}
          >
            <Avatar
              image={profileData.avatar ?
                `${profileData.baseUrl}/${profileData.avatar}` :
                ''
              }
              size={40}
              userInitials={initials}
              userInitialsStyle={{
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0px'
              }}
            />
          </button>
        );
    }

    renderFeedNotifications = () => {
        const feedNotifs = this.props.notificationsState.get('notifFeed');
        const notifs = [];
        feedNotifs.forEach((val, index) => {
            if (val.type === eventTypes.PUBLISH) {
                return notifs.push(this._renderEntry(val, index));
            }
            if (val.type === eventTypes.COMMENT) {
                return notifs.push(this._renderComment(val, index));
            }
            if (val.type === eventTypes.VOTE) {
                return notifs.push(this._renderVote(val, index));
            }
            return null;
        });
        return (<List>{notifs}</List>);
    };

    renderYouNotifs = () => {
        const youNotifs = this.props.notificationsState.get('youFeed');
        const notifs = [];
        youNotifs.forEach((val, index) => {
            if (val.type === eventTypes.PUBLISH) {
                return notifs.push(this._renderEntry(val, index));
            }
            if (val.type === eventTypes.COMMENT) {
                return notifs.push(this._renderComment(val, index));
            }
            if (val.type === eventTypes.VOTE) {
                return notifs.push(this._renderVote(val, index));
            }
            if (val.type === eventTypes.FOLLOWING) {
                return notifs.push(this._renderFollower(val, index));
            }
            if (val.type === eventTypes.GOT_TIPPED) {
                return notifs.push(this._renderTip(val, index));
            }
            if (val.type === eventTypes.ENTRY_MENTION ||
                    val.type === eventTypes.COMMENT_MENTION) {
                return notifs.push(this._renderMention(val, index));
            }
            return null;
        });
        return (<List>{notifs}</List>);
    };

    render () {
        const { loggedProfileData, profileActions, profileAddress, showPanel, hidePanel,
            notificationsState } = this.props;
        const { palette } = this.context.muiTheme;
        return (
          <Paper
            style={{
                width: (this.props.width || 480),
                zIndex: 10,
                position: 'relative',
                height: '100%',
                borderRadius: 0
            }}
          >
            <UserProfileHeader
              profile={loggedProfileData}
              profileActions={profileActions}
              profileAddress={profileAddress}
              showPanel={showPanel}
              hidePanel={hidePanel}
            />
            <div style={{ width: '100%', marginTop: '-48px' }} >
              <div>
                <Tabs
                  tabItemContainerStyle={{ backgroundColor: 'transparent' }}
                  inkBarStyle={{ backgroundColor: palette.primary1Color }}
                >
                  <Tab
                    label="FEED"
                    style={tabStyles.default_tab}
                    onActive={() => {
                        this.setState({ selected: FEED_SELECTED });
                        this.readSubscriptionNotif();
                    }}
                  >
                    <div style={this.getStyle(FEED_SELECTED)} >
                      {this.renderFeedNotifications()}
                    </div>
                  </Tab>
                  <Tab
                    label={
                      <span>
                        You <sup style={{ color: colors.red500 }} >({notificationsState.get('youNrFeed')})</sup>
                      </span>
                                }
                    style={tabStyles.default_tab}
                    onActive={() => {
                        this.setState({ selected: YOU_SELECTED });
                        this.readYouNotif(notificationsState.get('youNrFeed'));
                    }}
                  >
                    <div style={this.getStyle(YOU_SELECTED)} >
                      {this.renderYouNotifs()}
                    </div>
                  </Tab>
                  <Tab
                    label="MESSAGES"
                    style={tabStyles.default_tab}
                    disabled
                    onActive={() => this.setState({ selected: MESSAGES_SELECTED })}
                  >
                    <div style={this.getStyle(MESSAGES_SELECTED)} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </Paper>
        );
    }
}
UserProfilePanel.propTypes = {
    width: PropTypes.string,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    params: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileAddress: PropTypes.string,
    mutedList: PropTypes.arrayOf(PropTypes.string),
    notificationsActions: PropTypes.shape(),
    notificationsState: PropTypes.shape(),
    settingsActions: PropTypes.shape(),
    showPanel: PropTypes.func,
    hidePanel: PropTypes.func
};
UserProfilePanel.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default injectIntl(UserProfilePanel);
