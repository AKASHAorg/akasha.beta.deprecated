import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Paper, Tabs, Tab } from 'material-ui';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import { profileMessages } from 'locale-data/messages';
import { AppActions, ProfileActions, SettingsActions } from 'local-flux';
import { DataLoader, ProfileCard } from 'shared-components';
import { isInViewport } from 'utils/domUtils';

const LIMIT = 13;
const AKASHA_ID = 'i.follow.everyone';

class PeopleContainer extends Component {

    constructor (props) {
        super(props);

        this.trigger = null;
        this.firstTimeCheckForMore = false;
        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.lastNewestIndex = 0;
        this.state = {
            activeTab: 'newest'
        };
    }

    componentDidMount () {
        const { profileActions } = this.props;
        profileActions.followingIterator(AKASHA_ID, this.lastNewestIndex, LIMIT);
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledScrollHandler);
            window.addEventListener('resize', this.throttledScrollHandler);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { loggedProfileData, followerProfileData } = nextProps;
        const followersSize = loggedProfileData.get('followers').size;
        const followingSize = loggedProfileData.get('following').size;
        const newestSize = followerProfileData && followerProfileData.get('following').size;

        if (followersSize !== this.props.loggedProfileData.get('followers').size &&
                this.state.activeTab === 'followers') {
            this.lastFollowerIndex = loggedProfileData.get('followers').size > 0 ?
                loggedProfileData.get('followers').last().get('index') :
                0;
        }
        if (followingSize !== this.props.loggedProfileData.get('following').size &&
                this.state.activeTab === 'following') {
            this.lastFollowingIndex = loggedProfileData.get('following').size > 0 ?
                loggedProfileData.get('following').last().get('index') :
                0;
        }
        if (newestSize !== (this.props.followerProfileData &&
                this.props.followerProfileData.get('following').size) &&
                this.state.activeTab === 'newest') {
            this.lastNewestIndex = followerProfileData.get('following').size > 0 ?
                followerProfileData.get('following').last().get('index') :
                0;
        }
    }

    componentWillUpdate (nextProps, nextState) {
        const { profileActions, loggedProfileData } = this.props;
        if (this.state.activeTab !== nextState.activeTab) {
            switch (nextState.activeTab) {
                case 'newest':
                    profileActions.clearFollowers(loggedProfileData.akashaId);
                    profileActions.clearFollowing(loggedProfileData.akashaId);
                    profileActions.followingIterator(AKASHA_ID, this.lastNewestIndex, LIMIT);
                    break;
                case 'followers':
                    profileActions.clearFollowing(AKASHA_ID);
                    profileActions.clearFollowing(loggedProfileData.akashaId);
                    profileActions.followersIterator(
                        loggedProfileData.akashaId, this.lastFollowerIndex, LIMIT
                    );
                    break;
                case 'following':
                    profileActions.clearFollowing(AKASHA_ID);
                    profileActions.clearFollowers(loggedProfileData.akashaId);
                    profileActions.followingIterator(
                        loggedProfileData.akashaId, this.lastFollowingIndex, LIMIT
                    );
                    break;
                default:
                    break;
            }
        }
    }

    componentDidUpdate () {
        if (this.trigger && !this.firstTimeCheckForMore) {
            this.firstTimeCheckForMore = true;
            this.handleScroll();
        }
    }

    componentWillUnmount () {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.clearFollowers(loggedProfileData.akashaId);
        profileActions.clearFollowing(loggedProfileData.akashaId);
        profileActions.clearFollowing(AKASHA_ID);
        profileActions.clearOtherProfiles();
        window.removeEventListener('resize', this.throttledScrollHandler);
    }

    handleScroll = () => {
        if (!this.trigger) {
            return null;
        }

        if (isInViewport(this.trigger)) {
            switch (this.state.activeTab) {
                case 'newest':
                    this.showMoreNewest();
                    break;
                case 'followers':
                    this.showMoreFollowers();
                    break;
                case 'following':
                    this.showMoreFollowing();
                    break;
                default:
                    break;
            }
        }
    };

    throttledScrollHandler = throttle(this.handleScroll, 500);

    getTabStyle = (tab) => {
        const { palette } = this.context.muiTheme;

        return {
            color: this.state.activeTab === tab ? palette.textColor : palette.disabledColor
        };
    };

    handleChangeTab = (tab) => {
        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.lastNewestIndex = 0;
        this.firstTimeCheckForMore = false;
        this.setState({
            activeTab: tab
        });
    }

    followProfile = (akashaId, profile) => {
        const { profileActions } = this.props;
        profileActions.addFollowProfileAction(akashaId, profile);
    };

    unfollowProfile = (akashaId, profile) => {
        const { profileActions } = this.props;
        profileActions.addUnfollowProfileAction(akashaId, profile);
    };

    selectProfile = (address) => {
        const { router } = this.context;
        const basePath = this.props.loggedProfileData.get('akashaId');
        router.push(`/${basePath}/profile/${address}`);
    }

    sendTip = (profileData) => {
        const { profileActions } = this.props;
        const { akashaId, firstName, lastName, profile } = profileData;
        profileActions.addSendTipAction({ akashaId, firstName, lastName, profile });
    }

    showMoreNewest = () => {
        const { profileActions } = this.props;
        profileActions.moreFollowingIterator(AKASHA_ID, this.lastNewestIndex, LIMIT);
    };

    showMoreFollowers = () => {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.moreFollowersIterator(
            loggedProfileData.akashaId, this.lastFollowerIndex, LIMIT
        );
    };

    showMoreFollowing = () => {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.moreFollowingIterator(
            loggedProfileData.akashaId, this.lastFollowingIndex, LIMIT
        );
    };

    renderNewest () {
        const { fetchingFollowing, fetchingMoreFollowing, followerProfileData } = this.props;
        const followings = followerProfileData ?
            followerProfileData
                .get('following')
                .map(following => following.get('profile'))
                .toJS() :
            [];

        if (!followerProfileData || fetchingFollowing) {
            return <DataLoader flag size={80} style={{ paddingTop: '120px' }} />;
        }

        return this.renderProfileList(
            followings, fetchingFollowing, fetchingMoreFollowing,
            followerProfileData.get('moreFollowing'), 'No profiles found'
        );
    }

    renderFollowers () {
        const { fetchingFollowers, fetchingMoreFollowers, loggedProfileData } = this.props;
        const followers = loggedProfileData.get('followers')
            .map(follower => follower.get('profile'))
            .toJS();

        return this.renderProfileList(
            followers, fetchingFollowers, fetchingMoreFollowers,
            loggedProfileData.get('moreFollowers'), 'No followers'
        );
    }

    renderFollowing () {
        const { fetchingFollowing, fetchingMoreFollowing, loggedProfileData } = this.props;
        const followings = loggedProfileData
            .get('following')
            .map(following => following.get('profile'))
            .toJS();

        return this.renderProfileList(
            followings, fetchingFollowing, fetchingMoreFollowing,
            loggedProfileData.get('moreFollowing'), 'No following'
        );
    }

    renderProfileList = (profiles, fetching, fetchingMore, moreProfiles, emptyPlaceholder) => {
        const { appActions, followingsList, followPending, loggedProfileData,
            mutedList, sendingTip, settingsActions } = this.props;
        const { palette } = this.context.muiTheme;

        return (<DataLoader
          flag={fetching}
          timeout={700}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {profiles.length === 0 &&
              <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: palette.disabledColor,
                    paddingTop: '10px'
                }}
              >
                {emptyPlaceholder}
              </div>
            }
            {profiles.map((prf) => {
                const followProfilePending = followPending && followPending.find(follow =>
                    follow.akashaId === prf.akashaId);
                const isFollower = followingsList.includes(prf.profile);
                const sendTipPending = sendingTip && sendingTip.find(flag =>
                    flag.akashaId === prf.akashaId);
                const isMuted = mutedList && mutedList.indexOf(prf.profile) !== -1;
                return prf &&
                  <ProfileCard
                    key={prf.akashaId}
                    disableNotifFrom={settingsActions.disableNotifFrom}
                    enableNotifFrom={settingsActions.enableNotifFrom}
                    loggedProfileData={loggedProfileData}
                    profileData={prf}
                    followProfile={this.followProfile}
                    unfollowProfile={this.unfollowProfile}
                    followPending={followProfilePending && followProfilePending.value}
                    isFollower={isFollower}
                    isMuted={isMuted}
                    selectProfile={this.selectProfile}
                    sendTip={this.sendTip}
                    sendTipPending={sendTipPending && sendTipPending.value}
                    showPanel={appActions.showPanel}
                  />;
            })}
            {moreProfiles &&
              <DataLoader flag={fetchingMore} size={30}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <div ref={(el) => { this.trigger = el; }} style={{ height: 0 }} />
                </div>
              </DataLoader>
            }
          </div>
        </DataLoader>);
    }

    render () {
        const { params, loggedProfileData, intl } = this.props;
        const { palette } = this.context.muiTheme;
        const { followersCount, followingCount } = loggedProfileData;

        if (params.profileAddress) {
            return this.props.children;
        }

        return (<div style={{ flex: '1 1 auto', height: '100%', width: 'calc(100% + 0.5rem)' }}>
          <Paper style={{ position: 'fixed', zIndex: 3, width: '100%' }}>
            <Tabs
              style={{ paddingLeft: '100px' }}
              tabItemContainerStyle={{ width: '500px', backgroundColor: 'transparent' }}
              onChange={this.handleChangeTab}
              value={this.state.activeTab}
              inkBarStyle={{ backgroundColor: palette.primary1Color }}
            >
              <Tab
                label="Latest people"
                style={this.getTabStyle('newest')}
                value="newest"
              />
              <Tab
                label={
                  <span>
                    {intl.formatMessage(profileMessages.followers)}
                    {followersCount !== null &&
                      <span style={{ marginLeft: '5px' }}>({followersCount})</span>
                    }
                  </span>
                }
                style={this.getTabStyle('followers')}
                value="followers"
              />
              <Tab
                label={
                  <span>
                    {intl.formatMessage(profileMessages.following)}
                    {followingCount !== null &&
                      <span style={{ marginLeft: '5px' }}>({followingCount})</span>
                    }
                  </span>
                }
                style={this.getTabStyle('following')}
                value="following"
              />
            </Tabs>
          </Paper>
          <div style={{ padding: '15px', position: 'relative', height: 'calc(100% - 48px)', top: '48px' }}>
            <div
              style={{
                  position: 'absolute',
                  top: '0px',
                  left: '0',
                  right: '0px',
                  bottom: '0px',
                  overflowY: 'auto',
                  padding: '30px 0px 30px 100px'
              }}
              ref={(el) => { this.container = el; }}
            >
              {this.state.activeTab === 'newest' && this.renderNewest()}
              {this.state.activeTab === 'followers' && this.renderFollowers()}
              {this.state.activeTab === 'following' && this.renderFollowing()}
            </div>
          </div>
        </div>);
    }
}

PeopleContainer.propTypes = {
    appActions: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    fetchingMoreFollowing: PropTypes.bool,
    isFollowerPending: PropTypes.bool,
    followerProfileData: PropTypes.shape(),
    followingsList: PropTypes.shape(),
    followPending: PropTypes.shape(),
    mutedList: PropTypes.arrayOf(PropTypes.string),
    profileActions: PropTypes.shape(),
    params: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
    settingsActions: PropTypes.shape(),
    children: PropTypes.element,
    intl: PropTypes.shape()
};

PeopleContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    return {
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        fetchingMoreFollowers: state.profileState.getIn(['flags', 'fetchingMoreFollowers']),
        fetchingMoreFollowing: state.profileState.getIn(['flags', 'fetchingMoreFollowing']),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        followerProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('akashaId') === AKASHA_ID),
        followingsList: state.profileState.get('followingsList'),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        mutedList: state.settingsState.get('userSettings').notifications.muted,
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
        ...ownProps
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PeopleContainer));
