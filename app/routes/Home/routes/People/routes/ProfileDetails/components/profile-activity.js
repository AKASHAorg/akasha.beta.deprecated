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
        const { fetchingFollowers, profileData, profileActions, followPending, followProfile,
            unfollowProfile, selectProfile, showPanel, loggedProfileData, isFollowerPending,
            fetchingMoreFollowers } = this.props;
        const { palette } = this.context.muiTheme;
        const followers = profileData.get('followers');

        return (<DataLoader
          flag={fetchingFollowers}
          timeout={200}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }} >
            {followers.size === 0 &&
              <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: palette.disabledColor,
                    paddingTop: '10px'
                }}
              >
                No followers
              </div>
            }
            {followers.map((follower, key) => {
                const profile = follower.get('profile').toJS();
                const followProfilePending = followPending && followPending.find(follow =>
                    follow.akashaId === profile.akashaId);
                return profileData &&
                  <ProfileCard
                    key={key}
                    loggedProfileData={loggedProfileData}
                    profileData={profile}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    followPending={followProfilePending}
                    isFollowerPending={isFollowerPending}
                    selectProfile={selectProfile}
                    showPanel={showPanel}
                    isFollowerAction={profileActions.isFollower}
                  />;
            })}
            {profileData.get('moreFollowers') &&
              <DataLoader flag={fetchingMoreFollowers} size={30}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <div id="followers" ref={(el) => { this.trigger = el; }} style={{ height: 0 }} />
                </div>
              </DataLoader>
            }
          </div>
        </DataLoader>);
    }

    renderFollowing () {
        const { fetchingFollowing, profileData, profileActions, followPending,
            followProfile, unfollowProfile, selectProfile, showPanel, loggedProfileData,
            isFollowerPending, fetchingMoreFollowing } = this.props;
        const { palette } = this.context.muiTheme;
        const followings = profileData.get('following');

        return (<DataLoader
          flag={fetchingFollowing}
          timeout={200}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {followings.size === 0 &&
              <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: palette.disabledColor,
                    paddingTop: '10px'
                }}
              >
                No following
              </div>
            }
            {followings.map((following, key) => {
                const profile = following.get('profile').toJS();
                const followProfilePending = followPending && followPending.find(follow =>
                    follow.akashaId === profile.akashaId);
                return profileData &&
                  <ProfileCard
                    key={key}
                    loggedProfileData={loggedProfileData}
                    profileData={profile}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    followPending={followProfilePending}
                    isFollowerPending={isFollowerPending}
                    selectProfile={selectProfile}
                    showPanel={showPanel}
                    isFollowerAction={profileActions.isFollower}
                  />;
            })}
            {profileData.get('moreFollowing') &&
              <DataLoader flag={fetchingMoreFollowing} size={30}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <div id="following" ref={(el) => { this.trigger = el; }} style={{ height: 0 }} />
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
    followPending: PropTypes.shape(),
    isFollowerPending: PropTypes.bool,
    followProfile: PropTypes.func.isRequired,
    unfollowProfile: PropTypes.func.isRequired,
    selectProfile: PropTypes.func.isRequired,
    showPanel: PropTypes.func,
};

ProfileActivity.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default ProfileActivity;
