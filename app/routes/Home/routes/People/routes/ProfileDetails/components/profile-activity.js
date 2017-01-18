import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, Paper } from 'material-ui';
import { DataLoader, EntryListContainer, ProfileCard } from 'shared-components';
import throttle from 'lodash.throttle';
import { isInViewport } from 'utils/domUtils';

const ENTRIES_LIMIT = 6;
const PROFILES_LIMIT = 13;

class ProfileActivity extends Component {
    constructor (props) {
        super(props);

        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.lastEntryIndex = 0;
        this.firstTimeCheckForMore = false;
        this.trigger = null;
        this.state = {
            activeTab: 'entries'
        };
    }

    componentWillMount () {
        const { profileData, entryActions } = this.props;
        entryActions.entryProfileIterator(profileData.get('akashaId'), 0, ENTRIES_LIMIT);
    }

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', this.throttledScrollHandler);
            window.addEventListener('resize', this.throttledScrollHandler);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { profileData, profileEntries, entryActions } = nextProps;
        const followersSize = profileData.get('followers').size;
        const followingSize = profileData.get('following').size;
        const entriesSize = profileEntries.size;

        if (profileData.get('profile') !== this.props.profileData.get('profile')) {
            this.setState({
                activeTab: 'entries'
            });
            entryActions.entryProfileIterator(profileData.get('akashaId'), 0, ENTRIES_LIMIT);
        }

        if (followersSize !== this.props.profileData.get('followers').size &&
                this.state.activeTab === 'followers') {
            this.lastFollowerIndex = followersSize > 0 ?
                profileData.get('followers').last().get('index') :
                0;
        }
        if (followingSize !== this.props.profileData.get('following').size &&
                this.state.activeTab === 'following') {
            this.lastFollowingIndex = followingSize > 0 ?
                profileData.get('following').last().get('index') :
                0;
        }
        if (entriesSize !== this.props.profileEntries.size) {
            this.lastEntryIndex = entriesSize > 0 ?
                profileEntries.last().get('entryId') :
                0;
        }
    }

    componentWillUpdate (nextProps, nextState) {
        const { entryActions, profileActions, profileData } = this.props;
        if (this.state.activeTab !== nextState.activeTab) {
            switch (nextState.activeTab) {
                case 'entries':
                    profileActions.clearFollowing(profileData.akashaId);
                    profileActions.clearFollowers(profileData.akashaId);
                    entryActions.entryProfileIterator(profileData.akashaId, 0, ENTRIES_LIMIT);
                    break;
                case 'followers':
                    profileActions.clearFollowing(profileData.akashaId);
                    profileActions.followersIterator(
                        profileData.akashaId, this.lastFollowerIndex, PROFILES_LIMIT
                    );
                    break;
                case 'following':
                    profileActions.clearFollowers(profileData.akashaId);
                    profileActions.followingIterator(
                        profileData.akashaId, this.lastFollowingIndex, PROFILES_LIMIT
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
        const { profileActions, entryActions, profileData } = this.props;
        profileActions.clearFollowing(profileData.akashaId);
        profileActions.clearFollowers(profileData.akashaId);
        entryActions.clearProfileEntries();
        window.removeEventListener('resize', this.throttledScrollHandler);
    }

    handleScroll = () => {
        if (!this.trigger) {
            return null;
        }

        if (isInViewport(this.trigger)) {
            switch (this.state.activeTab) {
                case 'entries':
                    this.showMoreProfileEntries();
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
        this.firstTimeCheckForMore = false;
        this.setState({
            activeTab: tab
        });
    }

    showMoreProfileEntries = () => {
        const { entryActions, profileData } = this.props;
        const akashaId = profileData.get('akashaId');
        entryActions.moreEntryProfileIterator(akashaId, this.lastEntryIndex, ENTRIES_LIMIT);
    }

    showMoreFollowers = () => {
        const { profileActions, profileData } = this.props;
        profileActions.moreFollowersIterator(
            profileData.akashaId, this.lastFollowerIndex, PROFILES_LIMIT
        );
    }

    showMoreFollowing = () => {
        const { profileActions, profileData } = this.props;
        profileActions.moreFollowingIterator(
            profileData.akashaId, this.lastFollowingIndex, PROFILES_LIMIT
        );
    }

    renderEntries () {
        const { profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries } = this.props;
        return (<EntryListContainer
          entries={profileEntries}
          cardStyle={{ width: '670px' }}
          fetchingEntries={fetchingProfileEntries}
          fetchingMoreEntries={fetchingMoreProfileEntries}
          getTriggerRef={(el) => { this.trigger = el; }}
          moreEntries={moreProfileEntries}
          style={{ alignItems: 'flex-start' }}
        />);
    }

    renderFollowers () {
        const { fetchingFollowers, profileData, fetchingMoreFollowers } = this.props;
        const followers = profileData
            .get('followers')
            .map(follower => follower.get('profile'))
            .toJS();

        return this.renderProfileList(
            followers, fetchingFollowers, fetchingMoreFollowers, profileData.get('moreFollowers'),
            'No followers'
        );
    }

    renderFollowing () {
        const { fetchingFollowing, profileData, fetchingMoreFollowing } = this.props;
        const followings = profileData
            .get('following')
            .map(following => following.get('profile'))
            .toJS();

        return this.renderProfileList(
            followings, fetchingFollowing, fetchingMoreFollowing, profileData.get('moreFollowing'),
            'No following'
        );
    }

    renderProfileList = (profiles, fetching, fetchingMore, moreProfiles, emptyPlaceholder) => {
        const { profileData, profileActions, followPending, followProfile, unfollowProfile,
            selectProfile, showPanel, loggedProfileData, isFollowerPending, sendTip,
            sendingTip, settingsActions, mutedList } = this.props;
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
                const sendTipPending = sendingTip && sendingTip.find(flag =>
                    flag.akashaId === prf.akashaId);
                const isMuted = mutedList && mutedList.indexOf(prf.profile) !== -1;
                return profileData &&
                  <ProfileCard
                    disableNotifFrom={settingsActions.disableNotifFrom}
                    enableNotifFrom={settingsActions.enableNotifFrom}
                    key={prf.akashaId}
                    loggedProfileData={loggedProfileData}
                    profileData={prf}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    followPending={followProfilePending && followProfilePending.value}
                    isFollowerPending={isFollowerPending}
                    isMuted={isMuted}
                    selectProfile={selectProfile}
                    sendTip={sendTip}
                    sendTipPending={sendTipPending && sendTipPending.value}
                    showPanel={showPanel}
                    isFollowerAction={profileActions.isFollower}
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
        const { profileData } = this.props;
        const { palette } = this.context.muiTheme;
        const { entriesCount, followersCount, followingCount } = profileData;

        return (<div style={{ flex: '1 1 auto' }}>
          <Paper style={{ width: 'calc(100% + 0.5rem)', position: 'fixed', zIndex: 3 }}>
            <Tabs
              style={{ paddingLeft: '50px' }}
              tabItemContainerStyle={{ width: '500px', backgroundColor: 'transparent' }}
              onChange={this.handleChangeTab}
              value={this.state.activeTab}
              inkBarStyle={{ backgroundColor: palette.primary1Color }}
            >
              <Tab
                label={
                  <span>
                    All entries
                    {entriesCount !== null &&
                      <span style={{ marginLeft: '5px' }}>({entriesCount})</span>
                    }
                  </span>
                }
                style={this.getTabStyle('entries')}
                value="entries"
              />
              <Tab
                label={
                  <span>
                    Followers
                    {followersCount !== null &&
                      <span style={{ marginLeft: '5px' }}>({followersCount})</span>}
                  </span>
                }
                style={this.getTabStyle('followers')}
                value="followers"
              />
              <Tab
                label={
                  <span>
                    Following
                    {followingCount !== null &&
                      <span style={{ marginLeft: '5px' }}>({followingCount})</span>}
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
                  left: '45px',
                  right: '-7px',
                  bottom: '0px',
                  overflowY: 'auto',
                  padding: '30px 0'
              }}
              ref={(el) => { this.container = el; }}
            >
              {this.state.activeTab === 'entries' && this.renderEntries()}
              {this.state.activeTab === 'followers' && this.renderFollowers()}
              {this.state.activeTab === 'following' && this.renderFollowing()}
            </div>
          </div>
        </div>);
    }
}

ProfileActivity.propTypes = {
    loggedProfileData: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileData: PropTypes.shape(),
    profileEntries: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    fetchingMoreFollowing: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    fetchingProfileEntries: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
    mutedList: PropTypes.arrayOf(PropTypes.string),
    followPending: PropTypes.shape(),
    isFollowerPending: PropTypes.bool,
    followProfile: PropTypes.func.isRequired,
    unfollowProfile: PropTypes.func.isRequired,
    selectProfile: PropTypes.func.isRequired,
    sendingTip: PropTypes.shape(),
    sendTip: PropTypes.func.isRequired,
    settingsActions: PropTypes.shape(),
    showPanel: PropTypes.func,
};

ProfileActivity.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default ProfileActivity;
