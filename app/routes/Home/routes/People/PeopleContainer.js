import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Paper, Tabs, Tab, FlatButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { profileMessages, generalMessages } from 'locale-data/messages'
import { ProfileActions } from 'local-flux';
import { ProfileCard } from 'shared-components';

class PeopleContainer extends Component {

    constructor (props) {
        super(props);

        this.lastFollowerIndex = 0;
        this.lastFollowingIndex = 0;
        this.state = {
            activeTab: 'followers',
            followersRequested: false,
            followingRequested: false
        };
    }

    componentWillMount () {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.followersIterator(
            loggedProfileData.akashaId, this.lastFollowerIndex, 3
        );
    }

    componentWillReceiveProps (nextProps) {
        const { loggedProfileData, profileActions, fetchingFollowers } = nextProps;
        const followersCount = parseInt(loggedProfileData.get('followersCount'), 10);
        const followersSize = loggedProfileData.get('followers').size;
        const followingCount = parseInt(loggedProfileData.get('followingCount'), 10);
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
                        loggedProfileData.akashaId, this.lastFollowerIndex, 3
                    );
                    this.setState({
                        followersRequested: true
                    });
                    break;
                case 'following':
                    profileActions.clearFollowers(loggedProfileData.akashaId);
                    profileActions.followingIterator(
                        loggedProfileData.akashaId, this.lastFollowingIndex, 3
                    );
                    this.setState({
                        followingRequested: true
                    });
                    break;
                default:
                    break;
            }
        }
    }

    componentWillUnmount () {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.clearFollowers(loggedProfileData.akashaId);
    }

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
            activeTab: tab,
            followersRequested: false,
            followingRequested: false
        });
    }

    followProfile = (akashaId) => {
        const { profileActions, loggedProfile } = this.props;
        profileActions.followProfile(loggedProfile, akashaId);
    };

    unfollowProfile = (akashaId) => {
        const { profileActions, loggedProfile } = this.props;
        profileActions.unfollowProfile(loggedProfile, akashaId);
    };

    selectProfile = (address) => {
        const { router } = this.context;
        const basePath = this.props.loggedProfileData.get('akashaId');
        router.push(`/${basePath}/profile/${address}`);
    }

    showMoreFollowers = () => {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.followersIterator(loggedProfileData.akashaId, this.lastFollowerIndex, 3);
    };

    showMoreFollowing = () => {
        const { profileActions, loggedProfileData } = this.props;
        profileActions.followingIterator(loggedProfileData.akashaId, this.lastFollowingIndex, 3);
    };

    renderFollowers () {
        const { fetchingFollowers, profileActions, followPending, loggedProfileData,
            isFollowerPending, intl } = this.props;
        const followers = loggedProfileData.get('followers').toJS();

        if (!followers.length && !fetchingFollowers) {
            return <div>No followers</div>;
        }

        return <div>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FlatButton
                label={intl.formatMessage(generalMessages.showMore)}
                onClick={this.showMoreFollowers}
                style={{ margin: '10px' }}
                primary
              />
            </div>
          }
        </div>;
    }

    renderFollowing () {
        const { fetchingFollowing, profileActions, followPending, loggedProfileData,
            isFollowerPending, intl } = this.props;
        const followings = loggedProfileData.get('following').toJS();

        if (!followings.length && !fetchingFollowing) {
            return <div>No following</div>;
        }

        return <div>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FlatButton
                label={intl.formatMessage(generalMessages.showMore)}
                onClick={this.showMoreFollowing}
                style={{ margin: '10px' }}
                primary
              />
            </div>
          }
        </div>;
    }

    render () {
        const { params, loggedProfileData, intl } = this.props;
        const { followersCount, followingCount } = loggedProfileData;

        if (params.profileAddress) {
            return this.props.children;
        }

        return <div style={{ flex: '1 1 auto', height: '100%' }}>
          <Paper>
            <Tabs
              style={{ paddingLeft: '100px' }}
              tabItemContainerStyle={{ width: '500px', backgroundColor: 'transparent' }}
              onChange={this.handleChangeTab}
              value={this.state.activeTab}
            >
              <Tab
                label={
                  <span>
                    {intl.formatMessage(profileMessages.followers)}
                    {followersCount !== null &&
                      <span style={{ marginLeft: '5px'}}>({followersCount})</span>
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
                      <span style={{ marginLeft: '5px'}}>({followingCount})</span>
                    }
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
                  left: '100px',
                  right: '100px',
                  bottom: '45px',
                  overflowY: 'auto',
                  padding: '30px 0'
              }}
            >
              {this.state.activeTab === 'followers' && this.renderFollowers()}
              {this.state.activeTab === 'following' && this.renderFollowing()}
            </div>
          </div>
        </div>;
    }
}

PeopleContainer.propTypes = {
    loggedProfileData: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    isFollowerPending: PropTypes.bool,
    followPending: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    params: PropTypes.shape(),
    children: PropTypes.element
};

PeopleContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    return {
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        loggedProfile: state.profileState.get('loggedProfile'),
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        ...ownProps
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PeopleContainer));
