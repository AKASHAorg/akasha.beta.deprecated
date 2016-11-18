import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, Paper, FlatButton } from 'material-ui';
import { ProfileCard } from 'shared-components';
import { injectIntl } from 'react-intl';
import { profileMessages } from 'locale-data/messages'

class ProfileActivity extends Component {
    constructor (props) {
        super(props);

        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.state = {
            activeTab: 'entries',
            followersRequested: false,
            followingRequested: false
        };
    }

    componentWillReceiveProps (nextProps) {
        const { profileData, profileActions, fetchingFollowers } = nextProps;
        const followersCount = parseInt(profileData.get('followersCount'), 10);
        const followersSize = profileData.get('followers').size;
        const followingCount = parseInt(profileData.get('followingCount'), 10);
        const followingSize = profileData.get('following').size;

        if (profileData.get('profile') !== this.props.profileData.get('profile')) {
            this.setState({
                activeTab: 'entries',
                followersRequested: false,
                followingRequested: false
            });
        }

        if (followersSize !== this.props.profileData.get('followers').size &&
                this.state.activeTab === 'followers') {
            this.lastFollowerIndex = profileData.get('followers').size > 0 ?
                profileData.get('followers').last().get('index') :
                0;
        }
        if (followingSize !== this.props.profileData.get('following').size &&
                this.state.activeTab === 'following') {
            this.lastFollowingIndex = profileData.get('following').size > 0 ?
                profileData.get('following').last().get('index') :
                0;
        }
    }

    componentWillUpdate (nextProps, nextState) {
        const { profileActions, profileData } = this.props;
        if (this.state.activeTab !== nextState.activeTab) {
            switch (nextState.activeTab) {
                case 'entries':
                    // TODO should fetch entries
                    break;
                case 'followers':
                    if (!this.state.followersRequested) {
                        profileActions.followersIterator(
                            profileData.akashaId, this.lastFollowerIndex, 3
                        );
                        this.setState({
                            followersRequested: true
                        });
                    }
                    break;
                case 'following':
                    if (!this.state.followingRequested) {
                        profileActions.followingIterator(
                            profileData.akashaId, this.lastFollowingIndex, 3
                        );
                        this.setState({
                            followingRequested: true
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }

    getTabStyle = (tab) => {
        const { palette } = this.context.muiTheme;

        return {
            color: this.state.activeTab === tab ? palette.textColor : palette.disabledColor
        };
    };

    handleChangeTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    }

    showMoreFollowers = () => {
        const { profileActions, profileData } = this.props;
        profileActions.followersIterator(profileData.akashaId, this.lastFollowerIndex, 3);
    }

    showMoreFollowing = () => {
        const { profileActions, profileData } = this.props;
        profileActions.followingIterator(profileData.akashaId, this.lastFollowingIndex, 3);
    }

    renderEntries () {
        return null;
    }

    renderFollowers () {
        const { fetchingFollowers, profileData, profileActions, followPending, followProfile,
            unfollowProfile, selectProfile, loggedProfileData, isFollowerPending,
            intl } = this.props;
        const followers = profileData.get('followers').toJS();

        if (!followers.length && fetchingFollowers) {
            return <div>Loading followers</div>;
        } else if (!followers.length && !fetchingFollowers) {
            return <div>No followers</div>;
        }

        return <div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }} >
            {followers.map((follower, key) => {
                const profile = follower.profile;
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
                    isFollowerAction={profileActions.isFollower}
                  />;
            })}
          </div>
          {profileData.get('moreFollowers') &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FlatButton
                label={intl.formatMessage(profileMessages.showMore)}
                onClick={this.showMoreFollowers}
                style={{ margin: '10px' }}
                primary
              />
            </div>
          }
        </div>;
    }

    renderFollowing () {
        const { fetchingFollowing, profileData, profileActions, followPending,
            followProfile, unfollowProfile, selectProfile, loggedProfileData, isFollower,
            isFollowerPending, intl } = this.props;
        const followings = profileData.get('following').toJS();

        if (!followings.length && fetchingFollowing) {
            return <div>Loading following</div>;
        } else if (!followings.length && !fetchingFollowing) {
            return <div>No following</div>;
        }

        return <div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }} >
            {followings.map((following, key) => {
                const profile = following.profile;
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
                    isFollowerAction={profileActions.isFollower}
                  />;
            })}
          </div>
          {profileData.get('moreFollowing') &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FlatButton
                label={intl.formatMessage(profileMessages.showMore)}
                onClick={this.showMoreFollowing}
                style={{ margin: '10px' }}
                primary
              />
            </div>
          }
        </div>;
    }

    render () {
        const { profileData } = this.props;
        const { entriesCount, followersCount, followingCount, subscriptionsCount } = profileData;

        return <div style={{ flex: '1 1 auto' }}>
          <Paper>
            <Tabs
              style={{ paddingLeft: '50px' }}
              tabItemContainerStyle={{ width: '500px', backgroundColor: 'transparent' }}
              onChange={this.handleChangeTab}
              value={this.state.activeTab}
            >
              <Tab
                label={
                  <span>
                    All entries
                    {entriesCount !== null &&
                      <span style={{ marginLeft: '5px'}}>({entriesCount})</span>
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
                      <span style={{ marginLeft: '5px'}}>({followersCount})</span>}
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
                      <span style={{ marginLeft: '5px'}}>({followingCount})</span>}
                  </span>
                }
                style={this.getTabStyle('following')}
                value="following"
              />
            </Tabs>
          </Paper>
          <div style={{ padding: '15px', position: 'relative', height: '100%' }}>
            <div
              style={{
                  position: 'absolute',
                  top: '0px',
                  left: '30px',
                  right: '30px',
                  bottom: '45px',
                  overflowY: 'auto',
                  padding: '30px 0'
              }}
            >
              {this.state.activeTab === 'entries' && this.renderEntries()}
              {this.state.activeTab === 'tags' && this.renderTags()}
              {this.state.activeTab === 'followers' && this.renderFollowers()}
              {this.state.activeTab === 'following' && this.renderFollowing()}
            </div>
          </div>
        </div>;
    }
}

ProfileActivity.propTypes = {
    loggedProfileData: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileData: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    followPending: PropTypes.shape(),
    isFollowerPending: PropTypes.bool,
    followProfile: PropTypes.func.isRequired,
    unfollowProfile: PropTypes.func.isRequired,
    selectProfile: PropTypes.func.isRequired
};

ProfileActivity.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default injectIntl(ProfileActivity);
