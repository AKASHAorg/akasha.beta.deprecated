import React, { PropTypes, Component } from 'react';
import { colors } from 'material-ui/styles';
import { Paper, Tabs, Tab, List, ListItem } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Avatar } from 'shared-components';
import { getInitials } from 'utils/dataModule';
import UserProfileHeader from './user-profile/user-profile-header';

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
    GOT_TIPPED: 'gotTipped'
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

    navigateToTag (tag) {
        const { hidePanel, params } = this.props;
        hidePanel();
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
    }

    navigateToProfile (profileAddress) {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        this.props.hidePanel();
        router.push(`/${loggedAkashaId}/profile/${profileAddress}`);
    }

    navigateToEntry (entryId) {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        this.props.hidePanel();
        router.push(`/${loggedAkashaId}/entry/${entryId}`);
    }

    _renderFollower (event, index) {
        return (
          <ListItem
            leftAvatar={this.renderAvatar(event.follower)}
            primaryText={
              <strong
                onClick={() => {
                    this.navigateToProfile(event.follower.profile);
                }}
                style={{ color: colors.darkBlack }}
              >
                {event.follower.akashaId}
              </strong>
                }
            secondaryText={
              <p>
                <span style={{ color: colors.darkBlack }}>
                  Followed you.
                </span>
                <br />
                Block {event.blockNumber}
              </p>
            }
            secondaryTextLines={2}
            key={eventTypes.FOLLOWING + index + event.blockNumber}
            className="has_hidden_action"
            rightIcon={<ActionDelete
              className="hidden_action"
              onClick={() => {
                  this.props.notificationsActions.deleteYouNotif(index);
              }}
            />}
          />);
    }

    _renderEntry (event, index) {
        const tags = [].concat(event.tag);
        const tagsMessage = tags.length > 1 ? 'tags' : 'tag';
        const tagsArray = tags.map((tag, key) =>
          <span key={tag}>
            <span className="link" onClick={() => { this.navigateToTag(tag); }}>{tag}</span>
            {key !== tags.length - 1 ? ', ' : ''}
          </span>
        );
        if (!event.entry.content) {
            return null;
        }
        return (
          <ListItem
            leftAvatar={this.renderAvatar(event.author)}
            primaryText={
              <strong
                onClick={() => {
                    this.navigateToProfile(event.profileAddress);
                }}
                style={{ color: colors.darkBlack }}
              >
                {event.author.akashaId}
              </strong>
            }
            secondaryText={
              <p>
                <span style={{ color: colors.darkBlack }} >
                  Published&nbsp;
                  <span
                    className="link"
                    onClick={() => { this.navigateToEntry(event.entry.entryId); }}
                  >
                    {event.entry.content.title}
                  </span>
                  &nbsp;on {tagsMessage}&nbsp;
                  {tagsArray}
                </span>
                <br />
                Block {event.blockNumber}
              </p>
            }
            secondaryTextLines={2}
            key={eventTypes.PUBLISH + index + event.blockNumber}
            className="has_hidden_action"
            rightIcon={<ActionDelete
              className="hidden_action"
              onClick={() => {
                  if (this.props.loggedProfileData.get('profile') === event.profileAddress) {
                      return this.props.notificationsActions.deleteYouNotif(index);
                  }
                  return this.props.notificationsActions.deleteFeedNotif(index);
              }}
            />}
          />);
    }

    _renderComment (event, index) {
        if (!event.entry.content) {
            return null;
        }
        return (
          <ListItem
            leftAvatar={this.renderAvatar(event.author)}
            primaryText={
              <strong
                onClick={() => {
                    this.navigateToProfile(event.profileAddress);
                }} style={{ color: colors.darkBlack }}
              >
                {event.author.akashaId}
              </strong>
            }
            secondaryText={
              <p>
                <span style={{ color: colors.darkBlack }} >
                  Commented on&nbsp;
                  <span
                    className="link"
                    onClick={() => { this.navigateToEntry(event.entry.entryId); }}
                  >
                    {event.entry.content.title}
                  </span>
                </span>
                <br />
                Block {event.blockNumber}
              </p>
            }
            secondaryTextLines={2}
            key={eventTypes.COMMENT + index + event.blockNumber}
            className="has_hidden_action"
            rightIcon={<ActionDelete
              className="hidden_action"
              onClick={() => {
                  if (this.props.loggedProfileData.get('profile') === event.profileAddress) {
                      return this.props.notificationsActions.deleteYouNotif(index);
                  }
                  return this.props.notificationsActions.deleteFeedNotif(index);
              }}
            />}
          />);
    }

    _renderVote (event, index) {
        const { palette } = this.context.muiTheme;
        const type = (event.weight > 0) ? 'Upvoted' : 'Downvoted';
        const colorVote = (event.weight > 0) ? palette.accent3Color : palette.accent1Color;
        const voteWeight = (event.weight > 0) ? (`+${event.weight}`) : event.weight;
        if (!event.entry.content) {
            return null;
        }
        return (
          <ListItem
            leftAvatar={this.renderAvatar(event.author)}
            primaryText={
              <strong
                onClick={() => {
                    this.navigateToProfile(event.profileAddress);
                }}
                style={{ color: colors.darkBlack }}
              >
                {event.author.akashaId}
              </strong>
            }
            secondaryText={
              <p>
                <span style={{ color: colors.darkBlack }} >
                  {type}<span style={{ color: colorVote }} > {voteWeight} </span>on&nbsp;
                  <span
                    className="link"
                    onClick={() => { this.navigateToEntry(event.entry.entryId); }}
                  >
                    {event.entry.content.title}
                  </span>
                </span>
                <br />
                Block {event.blockNumber}
              </p>
            }
            secondaryTextLines={2}
            key={eventTypes.VOTE + index + event.blockNumber}
            className="has_hidden_action"
            rightIcon={<ActionDelete
              className="hidden_action"
              onClick={() => {
                  if (this.props.loggedProfileData.get('profile') === event.profileAddress) {
                      return this.props.notificationsActions.deleteYouNotif(index);
                  }
                  return this.props.notificationsActions.deleteFeedNotif(index);
              }}
            />}
          />
        );
    }

    _renderTip (event, index) {
        return (
          <ListItem
            leftAvatar={this.renderAvatar(event.profile)}
            primaryText={
              <strong
                onClick={() => {
                    this.navigateToProfile(event.profile.profile);
                }}
                style={{ color: colors.darkBlack }}
              >
                {event.profile.akashaId}
              </strong>
            }
            secondaryText={
              <p>
                <span style={{ color: colors.darkBlack }} >
                  Tipped you
                  <strong style={{ color: '#008B8B', padding: '0 5px' }}>
                    {event.value}
                  </strong>
                  AETH
                </span>
                <br />
                Block {event.blockNumber}
              </p>
            }
            secondaryTextLines={2}
            key={eventTypes.GOT_TIPPED + index + event.blockNumber}
            className="has_hidden_action"
            rightIcon={<ActionDelete
              className="hidden_action"
              onClick={() => {
                  if (this.props.loggedProfileData.get('profile') === event.profileAddress) {
                      return this.props.notificationsActions.deleteYouNotif(index);
                  }
                  return this.props.notificationsActions.deleteFeedNotif(index);
              }}
            />}
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
              radius={40}
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
                    label="FEED" style={tabStyles.default_tab}
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
                    label="MESSAGES" style={tabStyles.default_tab} disabled
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
    loggedProfileData: PropTypes.shape(),
    params: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileAddress: PropTypes.string,
    notificationsActions: PropTypes.shape(),
    notificationsState: PropTypes.shape(),
    showPanel: PropTypes.func,
    hidePanel: PropTypes.func
};
UserProfilePanel.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default UserProfilePanel;
