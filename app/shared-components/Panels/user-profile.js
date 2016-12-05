import React, { PropTypes, Component } from 'react';
import { colors } from 'material-ui/styles';
import { Paper, Tabs, Tab, List, ListItem, Avatar } from 'material-ui';
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
    position: "fixed",
    top: "296px",
    width: "480px",
    bottom: "0px",
    overflow: "auto"
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

    renderFeedNotifications = () => {
        const youNotifs = this.props.notificationsState.get('notifFeed');
        const notifs = [];
        youNotifs.forEach((val) => {
            if (val.type === eventTypes.PUBLISH) {
                return notifs.push(this._renderEntry(val));
            }
            if (val.type === eventTypes.COMMENT) {
                return notifs.push(this._renderComment(val));
            }
            if (val.type === eventTypes.VOTE) {
                return notifs.push(this._renderVote(val));
            }

        });
        return (<List>{notifs}</List>)
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
        youNotifs.forEach((val) => {
            if (val.type === eventTypes.PUBLISH) {
                return notifs.push(this._renderEntry(val));
            }
            if (val.type === eventTypes.COMMENT) {
                return notifs.push(this._renderComment(val));
            }
            if (val.type === eventTypes.VOTE) {
                return notifs.push(this._renderVote(val));
            }
            if (val.type === eventTypes.FOLLOWING) {
                return notifs.push(this._renderFollower(val));
            }
        });
        return (<List>{notifs}</List>)
    };

    _renderFollower (event) {
        return (
            <ListItem
                leftAvatar={<Avatar src={event.follower.baseUrl + '/' + event.follower.avatar} />}
                primaryText={
                    <strong style={{ color: colors.darkBlack }} >
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
                key={eventTypes.FOLLOWING + event.follower.akashaId}
            />);
    };

    _renderEntry (event) {
        return (
            <ListItem
                leftAvatar={<Avatar src={event.author.baseUrl + '/' + event.author.avatar} />}
                primaryText={
                    <strong style={{ color: colors.darkBlack }} >
                        {event.author.akashaId}
                    </strong>
                }
                secondaryText={
                    <p>
                        <span style={{ color: colors.darkBlack }} >
                            Published <a style={{ fontWeight: '500' }} href="#" >{event.entry.content.title}</a> on tag <a
                            href="#" >{event.tag}</a>
                        </span><br />
                        Block {event.blockNumber}
                    </p>
                }
                secondaryTextLines={2}
                key={event.tag + event.entry.entryId}
            />);
    }

    _renderComment (event) {
        return (
            <ListItem
                leftAvatar={<Avatar src={event.author.baseUrl + '/' + event.author.avatar} />}
                primaryText={
                    <strong style={{ color: colors.darkBlack }} >
                        {event.author.akashaId}
                    </strong>
                }
                secondaryText={
                    <p>
                        <span style={{ color: colors.darkBlack }} >
                            Commented on <a style={{ fontWeight: '500' }} href="#" >{event.entry.content.title}</a>
                        </span><br />
                        Block {event.blockNumber}
                    </p>
                }
                secondaryTextLines={2}
                key={eventTypes.COMMENT + event.blockNumber + event.commentId}
            />);
    }

    _renderVote (event) {
        const type = (event.weight > 0) ? 'Upvoted' : 'Downvoted';
        return (
            <ListItem
                leftAvatar={<Avatar src={event.author.baseUrl + '/' + event.author.avatar} />}
                primaryText={
                    <strong style={{ color: colors.darkBlack }} >
                        {event.author.akashaId}
                    </strong>
                }
                secondaryText={
                    <p>
                        <span style={{ color: colors.darkBlack }} >
                            {type}({event.weight}) on <a style={{ fontWeight: '500' }}
                                                         href="#" >{event.entry.content.title}</a>
                        </span><br />
                        Block {event.blockNumber}
                    </p>
                }
                secondaryTextLines={2}
                key={eventTypes.VOTE + event.blockNumber}
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
                            <Tab label="FEED" style={tabStyles.default_tab}
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
                            <Tab label="MESSAGES" style={tabStyles.default_tab} disabled
                                 onActive={() => this.setState({ selected: MESSAGES_SELECTED })} >
                                <div style={this.getStyle(MESSAGES_SELECTED)} >

                                </div>
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

export default UserProfilePanel;
