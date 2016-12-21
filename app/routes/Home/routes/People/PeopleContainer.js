import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Paper, Tabs, Tab, FlatButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import { profileMessages, generalMessages } from 'locale-data/messages';
import { ProfileActions } from 'local-flux';
import { DataLoader, ProfileCard } from 'shared-components';
import { isInViewport } from 'utils/domUtils';

const LIMIT = 13;
const RECOMMENDED_PEOPLE = [
    { profile: '0xf01d0a16c63646aae5977726770c201a1891efb5' } // update this
];

class PeopleContainer extends Component {

    constructor (props) {
        super(props);

        this.trigger = null;
        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.state = {
            activeTab: 'recommended'
        };
    }

    componentWillMount () {
        const { profileActions, loggedProfileData } = this.props;
        // profileActions.followersIterator(
        //     loggedProfileData.akashaId, this.lastFollowerIndex, LIMIT
        // );
        profileActions.getProfileList(RECOMMENDED_PEOPLE);
    }

    componentDidMount () {
        if (this.container) {
            this.container.addEventListener('scroll', throttle(this.handleScroll, 500));
        }
    }

    componentWillReceiveProps (nextProps) {
        const { loggedProfileData } = nextProps;
        const followersSize = loggedProfileData.get('followers').size;
        const followingSize = loggedProfileData.get('following').size;

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
    }

    componentWillUpdate (nextProps, nextState) {
        const { profileActions, loggedProfileData } = this.props;
        if (this.state.activeTab !== nextState.activeTab) {
            switch (nextState.activeTab) {
                case 'followers':
                    profileActions.clearFollowing(loggedProfileData.akashaId);
                    profileActions.followersIterator(
                        loggedProfileData.akashaId, this.lastFollowerIndex, LIMIT
                    );
                    break;
                case 'following':
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

    componentWillUnmount () {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.clearFollowers(loggedProfileData.akashaId);
        profileActions.clearFollowing(loggedProfileData.akashaId);
    }

    handleScroll = () => {
        if (!this.trigger) {
            return null;
        }

        if (isInViewport(this.trigger)) {
            switch (this.state.activeTab) {
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

    getTabStyle = (tab) => {
        const { palette } = this.context.muiTheme;

        return {
            color: this.state.activeTab === tab ? palette.textColor : palette.disabledColor
        };
    };

    handleChangeTab = (tab) => {
        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.setState({
            activeTab: tab
        });
    }

    followProfile = (akashaId) => {
        const { profileActions } = this.props;
        profileActions.addFollowProfileAction(akashaId);
    };

    unfollowProfile = (akashaId) => {
        const { profileActions } = this.props;
        profileActions.addUnfollowProfileAction(akashaId);
    };

    selectProfile = (address) => {
        const { router } = this.context;
        const basePath = this.props.loggedProfileData.get('akashaId');
        router.push(`/${basePath}/profile/${address}`);
    }

    showMoreFollowers = () => {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.moreFollowersIterator(loggedProfileData.akashaId, this.lastFollowerIndex, LIMIT);
    };

    showMoreFollowing = () => {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.moreFollowingIterator(loggedProfileData.akashaId, this.lastFollowingIndex, LIMIT);
    };

    renderRecommended () {
        const { fetchingProfileList, followPending, intl, isFollowerPending, loggedProfileData,
            profileActions, profileList } = this.props;

        if (!profileList.size && !fetchingProfileList) {
            return <div>No recommandations</div>;
        }

        return (
          <DataLoader
            flag={fetchingProfileList}
            timeout={200}
            size={80}
            style={{ paddingTop: '120px' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }} >
              {profileList.toJS().map((profile, key) => {
                  const followProfilePending = followPending && followPending.find(follow =>
                      follow.akashaId === profile.akashaId);
                  return profile &&
                    <ProfileCard
                      key={key}
                      loggedProfileData={loggedProfileData}
                      profileData={profile}
                      followProfile={this.followProfile}
                      unfollowProfile={this.unfollowProfile}
                      followPending={followProfilePending}
                      isFollowerPending={isFollowerPending}
                      selectProfile={this.selectProfile}
                      isFollowerAction={profileActions.isFollower}
                    />;
              })}
            </div>
          </DataLoader>
        );
    }

    renderFollowers () {
        const { fetchingFollowers, fetchingMoreFollowers, profileActions, followPending,
            loggedProfileData, isFollowerPending, intl } = this.props;
        const followers = loggedProfileData.get('followers').toJS();

        if (!followers.length && !fetchingFollowers) {
            return <div>No followers</div>;
        }

        return (
          <DataLoader
            flag={fetchingFollowers}
            timeout={200}
            size={80}
            style={{ paddingTop: '120px' }}
          >
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                {followers.map((follower, key) => {
                    const profile = follower.profile;
                    const followProfilePending = followPending && followPending.find(follow =>
                        follow.akashaId === profile.akashaId);
                    return profile &&
                      <ProfileCard
                        key={key}
                        loggedProfileData={loggedProfileData}
                        profileData={profile}
                        followProfile={this.followProfile}
                        unfollowProfile={this.unfollowProfile}
                        followPending={followProfilePending}
                        isFollowerPending={isFollowerPending}
                        selectProfile={this.selectProfile}
                        isFollowerAction={profileActions.isFollower}
                      />;
                })}
              </div>
              {loggedProfileData.get('moreFollowers') &&
                <DataLoader flag={fetchingMoreFollowers} size={30}>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div id="followers" ref={(el) => { this.trigger = el; }} style={{ height: 0 }} />
                  </div>
                </DataLoader>
              }
            </div>
          </DataLoader>
        );
    }

    renderFollowing () {
        const { fetchingFollowing, fetchingMoreFollowing, profileActions, followPending, loggedProfileData,
            isFollowerPending, intl } = this.props;
        const followings = loggedProfileData.get('following').toJS();

        if (!followings.length && !fetchingFollowing) {
            return <div>No following</div>;
        }

        return (
          <DataLoader
            flag={fetchingFollowing}
            timeout={200}
            size={80}
            style={{ paddingTop: '120px' }}
          >
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                {followings.map((following, key) => {
                    const profile = following.profile;
                    const followProfilePending = followPending && followPending.find(follow =>
                        follow.akashaId === profile.akashaId);
                    return profile &&
                      <ProfileCard
                        key={key}
                        loggedProfileData={loggedProfileData}
                        profileData={profile}
                        followProfile={this.followProfile}
                        unfollowProfile={this.unfollowProfile}
                        followPending={followProfilePending}
                        isFollowerPending={isFollowerPending}
                        selectProfile={this.selectProfile}
                        isFollowerAction={profileActions.isFollower}
                      />;
                })}
              </div>
              {loggedProfileData.get('moreFollowing') &&
                <DataLoader flag={fetchingMoreFollowing} size={30}>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div id="following" ref={(el) => { this.trigger = el; }} style={{ height: 0 }} />
                  </div>
                </DataLoader>
              }
            </div>
          </DataLoader>
        );
    }

    render () {
        const { params, loggedProfileData, intl } = this.props;
        const { palette } = this.context.muiTheme;
        const { followersCount, followingCount } = loggedProfileData;

        if (params.profileAddress) {
            return this.props.children;
        }

        return (<div style={{ flex: '1 1 auto', height: '100%', width: 'calc(100% + 0.5rem)' }}>
          <Paper>
            <Tabs
              style={{ paddingLeft: '100px' }}
              tabItemContainerStyle={{ width: '500px', backgroundColor: 'transparent' }}
              onChange={this.handleChangeTab}
              value={this.state.activeTab}
              inkBarStyle={{ backgroundColor: palette.primary1Color }}
            >
              <Tab
                label="Recommended"
                style={this.getTabStyle('recommended')}
                value="recommended"
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
          <div style={{ padding: '15px', position: 'relative', height: 'calc(100% - 48px)' }}>
            <div
              style={{
                  position: 'absolute',
                  top: '0px',
                  left: '100px',
                  right: '0px',
                  bottom: '0px',
                  overflowY: 'auto',
                  padding: '30px 0px'
              }}
              ref={(el) => { this.container = el; }}
            >
              {this.state.activeTab === 'recommended' && this.renderRecommended()}
              {this.state.activeTab === 'followers' && this.renderFollowers()}
              {this.state.activeTab === 'following' && this.renderFollowing()}
            </div>
          </div>
        </div>);
    }
}

PeopleContainer.propTypes = {
    loggedProfileData: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    fetchingMoreFollowing: PropTypes.bool,
    fetchingProfileList: PropTypes.bool,
    isFollowerPending: PropTypes.bool,
    followPending: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileList: PropTypes.shape(),
    params: PropTypes.shape(),
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
        fetchingProfileList: state.profileState.getIn(['flags', 'fetchingProfileList']),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        profileList: state.profileState.get('profileList'),
        ...ownProps
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PeopleContainer));
