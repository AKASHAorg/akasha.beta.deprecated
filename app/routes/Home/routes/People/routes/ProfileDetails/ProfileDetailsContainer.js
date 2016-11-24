import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, EntryActions } from 'local-flux';
import ProfileDetails from './components/profile-details';
import ProfileActivity from './components/profile-activity';

class ProfileDetailsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFollowerRequested: false
        };
    }

    componentWillMount () {
        const { profileActions, params } = this.props;
        const { profileAddress } = params;
        profileActions.getProfileData([{ profile: profileAddress }], true);
    }

    componentWillReceiveProps (nextProps) {
        const { profiles, profileActions, params, profileData, loggedProfileData } = nextProps;
        if (params.profileAddress !== this.props.params.profileAddress) {
            if (profiles.size > 1) {
                profileActions.clearOtherProfiles();
            }
            profileActions.getProfileData([{ profile: params.profileAddress }], true);
        } else if (!this.state.isFollowerRequested && profileData && profileData.get('akashaId')) {
            profileActions.isFollower(loggedProfileData.get('akashaId'), profileData.get('akashaId'));
            this.setState({
                isFollowerRequested: true
            });
        }
    }

    componentWillUnmount () {
        const { profileActions, profileData } = this.props;
        if (profileData) {
            profileActions.clearFollowers(profileData.get('akashaId'));
        }
    }

    followProfile = (akashaId) => {
        const { profileActions } = this.props;
        profileActions.addFollowProfileAction(akashaId);
    }

    unfollowProfile = (akashaId) => {
        const { profileActions } = this.props;
        profileActions.addUnfollowProfileAction(akashaId);
    }

    selectProfile = (address) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        router.push(`/${loggedAkashaId}/profile/${address}`);
    }

    render () {
        const { profileActions, entryActions, profileData, profiles,
            followPending, fetchingFollowers, fetchingFollowing, fetchingProfileData,
            loggedProfileData, isFollowerPending } = this.props;

        if (!profileData ||
                profileData.get('backgroundImage')['/'] !== undefined) {
            return <div>Fetching data</div>;
        }

        const isFollower = loggedProfileData.getIn(['isFollower', profileData.get('akashaId')]);

        return <div style={{ display: 'flex', height: '100%' }}>
          <ProfileDetails
            loggedAddress={loggedProfileData.get('profile')}
            isFollowerPending={isFollowerPending}
            isFollower={isFollower}
            profileData={profileData}
            fetchingProfileData={fetchingProfileData}
            followProfile={this.followProfile}
            unfollowProfile={this.unfollowProfile}
            followPending={followPending}
          />
          <ProfileActivity
            loggedProfileData={loggedProfileData}
            profileData={profileData}
            profileActions={profileActions}
            getEntriesCount={entryActions.getEntriesCount}
            profiles={profiles}
            fetchingFollowers={fetchingFollowers}
            fetchingFollowing={fetchingFollowing}
            followPending={followPending}
            followProfile={this.followProfile}
            unfollowProfile={this.unfollowProfile}
            selectProfile={this.selectProfile}
            isFollowerPending={isFollowerPending}
          />
        </div>;
    }
}

ProfileDetailsContainer.propTypes = {
    profileActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    profileData: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    profiles: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    fetchingProfileData: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    params: PropTypes.shape(),
    followPending: PropTypes.shape(),
    loginRequested: PropTypes.bool,
    isFollowerPending: PropTypes.bool
};

ProfileDetailsContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const { profileAddress } = ownProps.params;

    return {
        profileAddress,
        profileData: state.profileState.get('profiles').find(profile =>
            profile && profile.get('profile') === profileAddress),
        profiles: state.profileState.get('profiles'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        loggedProfile: state.profileState.get('loggedProfile'),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailsContainer);
