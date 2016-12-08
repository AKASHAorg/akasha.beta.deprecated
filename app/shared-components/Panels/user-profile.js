import React, { PropTypes, Component } from 'react';
import { colors } from 'material-ui/styles';
import { Paper, Tabs, Tab, List, ListItem, Avatar } from 'material-ui';
import UserProfileHeader from './user-profile/user-profile-header';
import ActionDelete from 'material-ui/svg-icons/action/delete';

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
    FOLLOWING: 'following'
};
class UserProfilePanel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: FEED_SELECTED
        };
    }

    getStyle = (identity) => {
        if (identity === this.state.selected) {
            return selectedStyle;
        }
        return {};
    };

    componentDidMount () {
        this.readSubscriptionNotif();
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
        });
        return (<List>{notifs}</List>);
    };

    readSubscriptionNotif = () => {
        const { notificationsActions } = this.props;
        notificationsActions.readFeedNotif();
    };

    readYouNotif = (number) => {
        const { notificationsActions } = this.props;
        notificationsActions.readYouNotif(number);
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
        });
        return (<List>{notifs}</List>);
    };

    navigateToTag (tag) {
        const { tagActions, appActions } = this.props;
        appActions.hidePanel();
        tagActions.saveTag(tag);
    }

    navigateToProfile (profileAddress) {
        const { router } = this.context;
        const { appActions } = this.props;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        appActions.hidePanel();
        router.push(`/${loggedAkashaId}/profile/${profileAddress}`);
    }

    navigateToEntry (entryId) {
        const { router } = this.context;
        const { appActions } = this.props;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        appActions.hidePanel();
        router.push(`/${loggedAkashaId}/entry/${entryId}`);
    }

    _renderFollower (event, index) {
        return (
          <ListItem
            leftAvatar={<Avatar src={`${event.follower.baseUrl}/${event.follower.avatar}`} />}
            primaryText={
              <strong
                onClick={() => {
                    this.navigateToProfile(event.follower.profile);
                }} style={{ color: colors.darkBlack }}
              >
                {event.follower.akashaId}
              </strong>
                }
            secondaryText={
              <p>
                <span style={{ color: colors.darkBlack }} >
                            Followed you.
                        </span><br />
                        Block {event.blockNumber}
              </p>
                }
            secondaryTextLines={2}
            key={eventTypes.FOLLOWING + index}
            rightIcon={<ActionDelete
              onClick={(e) => {
                  this.props.notificationsActions.deleteYouNotif(index);
              }}
            />}
          />);
    }

    _renderEntry (event, index) {
        return (
          <ListItem
            leftAvatar={<Avatar src={`${event.author.baseUrl}/${event.author.avatar}`} />}
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
                            Published <span
                              className="link" onClick={() => {
                                  this.navigateToEntry(event.entry.entryId);
                              }}
                            >
                              {event.entry.content.title}</span> on tag &nbsp;
                    <span
                      className="link" onClick={() => {
                          this.navigateToTag(event.tag);
                      }}
                    >{event.tag}</span>
                </span><br />
                        Block {event.blockNumber}
              </p>
                }
            secondaryTextLines={2}
            key={eventTypes.PUBLISH + index}
            rightIcon={<ActionDelete
              onClick={(e) => {
                  if (this.props.loggedProfileData.get('profile') === event.profileAddress) {
                      return this.props.notificationsActions.deleteYouNotif(index);
                  }
                  return this.props.notificationsActions.deleteFeedNotif(index);
              }}
            />}
          />);
    }

    _renderComment (event, index) {
        return (
          <ListItem
            leftAvatar={<Avatar src={`${event.author.baseUrl}/${event.author.avatar}`} />}
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
                            Commented on <span
                              className="link" onClick={() => {
                                  this.navigateToEntry(event.entry.entryId);
                              }}
                            >
                              {event.entry.content.title}</span>
                </span><br />
                        Block {event.blockNumber}
              </p>
                }
            secondaryTextLines={2}
            key={eventTypes.COMMENT + index}
            rightIcon={<ActionDelete
              onClick={(e) => {
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

        return (
          <ListItem
            leftAvatar={<Avatar src={`${event.author.baseUrl}/${event.author.avatar}`} />}
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
                  {type}(<span style={{ color: colorVote }} >{voteWeight}</span>) on&nbsp;
                    <span
                      className="link" onClick={() => {
                          this.navigateToEntry(event.entry.entryId);
                      }}
                    >
                      {event.entry.content.title}
                    </span>
                </span><br />
                        Block {event.blockNumber}
              </p>
                }
            secondaryTextLines={2}
            key={eventTypes.VOTE + index}
            rightIcon={<ActionDelete
              onClick={(e) => {
                  if (this.props.loggedProfileData.get('profile') === event.profileAddress) {
                      return this.props.notificationsActions.deleteYouNotif(index);
                  }
                  return this.props.notificationsActions.deleteFeedNotif(index);
              }}
            />}
          />
        );
    }

    render () {
        const { loggedProfileData, profileActions, profileAddress, showPanel, notificationsState } = this.props;
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
            />
            <div style={{ width: '100%', marginTop: '-48px' }} >
              <div>
                <Tabs tabItemContainerStyle={{ backgroundColor: 'transparent' }} >
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
    profileActions: PropTypes.shape(),
    profileAddress: PropTypes.string,
    notificationsActions: PropTypes.shape(),
    showPanel: PropTypes.func
};
UserProfilePanel.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default UserProfilePanel;
