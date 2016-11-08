import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions } from 'local-flux';
import ProfileDetails from './components/profile-details';
import ProfileActivity from './components/profile-activity';

class ProfileDetailsContainer extends Component {
    componentWillMount () {
        const { profileActions, params } = this.props;
        const { profileAddress } = params;
        profileActions.getProfileData([{ profile: profileAddress }], true);
        profileActions.getFollowersCount(profileAddress);
        profileActions.getFollowingCount(profileAddress);
    }

    componentWillReceiveProps (nextProps) {
        if (!nextProps.loginRequested && this.props.loginRequested) {
            this.followProfile(null, nextProps.loggedProfile);
        }
    }

    followProfile = (event, logged) => {
        const { profileActions, params } = this.props;
        const { profileAddress } = params;
        const loggedProfile = logged || this.props.loggedProfile;
        profileActions.followProfile(loggedProfile, profileAddress);
    }

    render () {
        const { profileData, fetchingFullProfileData, followPending } = this.props;

        if (fetchingFullProfileData || !profileData) {
            return <div>Fetching data</div>;
        }

        return <div style={{ display: 'flex', height: '100%' }}>
          <ProfileDetails
            profileData={profileData}
            followProfile={this.followProfile}
            followPending={followPending}
          />
          <ProfileActivity />
        </div>;
    }
}

ProfileDetailsContainer.propTypes = {
    profileActions: PropTypes.shape(),
    profileData: PropTypes.shape(),
    fetchingFullProfileData: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    params: PropTypes.shape(),
    followPending: PropTypes.bool,
    loginRequested: PropTypes.bool
};

ProfileDetailsContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const { profileAddress } = ownProps.params;
    const followPending = state.profileState.getIn(['flags', 'followPending']) &&
        state.profileState.getIn(['flags', 'followPending']).find(follow =>
            follow.profileAddress === profileAddress);
    return {
        profileAddress,
        profileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === profileAddress),
        fetchingFullProfileData: state.profileState.get('fetchingFullProfileData'),
        loggedProfile: state.profileState.get('loggedProfile'),
        followPending: followPending && followPending.value,
        loginRequested: state.profileState.getIn(['flags', 'loginRequested'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailsContainer);
