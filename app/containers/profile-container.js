import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as profileActions from '../local-flux/actions/profile-actions';
import { DataLoader } from '../shared-components';
import ProfileDetails from '../components';
import { selectProfile } from '../local-flux/selectors';

class ProfileContainer extends Component {
    componentWillMount () {
        const { akashaId } = this.props.params.akashaId;
        profileActions.getProfileData([{ profile: akashaId }], true);
    }

    componentWillReceiveProps (nextProps) {
        const { profiles, params } = nextProps;
        if (params.akashaId !== this.props.params.akashaId) {
            profileActions.getProfileData([{ profile: params.akashaId }], true);
            if (profiles.size > 1) {
                profileActions.clearOtherProfiles();
            }
        }
    }

    componentWillUnmount () {
        profileActions.clearOtherProfiles();
    }

    followProfile = (akashaId, profile) => {
        profileActions.addFollowProfileAction(akashaId, profile);
    }

    unfollowProfile = (akashaId, profile) => {
        profileActions.addUnfollowProfileAction(akashaId, profile);
    }

    selectProfile = (address) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        router.push(`/${loggedAkashaId}/profile/${address}`);
    }

    sendTip = (profileData) => {
        const { akashaId, firstName, lastName, profile } = profileData;
        profileActions.addSendTipAction({ akashaId, firstName, lastName, profile });
    };

    render () {
        const { profileData, followingsList, followPending,
            loggedProfileData, sendingTip } = this.props;
        const isFollower = profileData && followingsList.includes(profileData.get('profile'));

        return (<DataLoader
          flag={!profileData}
          timeout={300}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            <ProfileDetails
              followPending={followPending}
              followProfile={this.followProfile}
              isFollower={isFollower}
              loggedAddress={loggedProfileData.get('profile')}
              profileData={profileData}
              sendingTip={sendingTip}
              sendTip={this.sendTip}
              unfollowProfile={this.unfollowProfile}
            />
          </div>
        </DataLoader>);
    }
}

ProfileContainer.propTypes = {
    followingsList: PropTypes.shape(),
    followPending: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    params: PropTypes.shape(),
    profileData: PropTypes.shape(),
    profiles: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
};

ProfileContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const { akashaId } = ownProps.params.akashaId;
    return {
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        followingsList: state.profileState.get('followingsList'),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        profileData: selectProfile(state, akashaId),
        profiles: state.profileState.get('profiles'),
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
        votePending: state.entryState.getIn(['flags', 'votePending']),
    };
}


export default connect(
    mapStateToProps,
    {}
)(ProfileContainer);
