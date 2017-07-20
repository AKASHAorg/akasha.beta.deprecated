import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { profileGetData, profileIsFollower, profileFollow, profileUnfollow, profileSendTip } from '../local-flux/actions/profile-actions';
import { DataLoader } from '../shared-components';
import { ProfileDetails } from '../components';
import { selectProfile } from '../local-flux/selectors';

class ProfileContainer extends Component {
    componentWillMount () {
        const akashaId = this.props.match.params.akashaId;
        this.props.profileGetData(akashaId, true);
        this.props.profileIsFollower([akashaId]);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.match.params.akashaId !== this.props.match.params.akashaId) {
            this.props.profileGetData(nextProps.match.params.akashaId, true);
            this.props.profileIsFollower([nextProps.match.params.akashaId]);
        }
    }

    // componentWillUnmount () {
    //     profileActions.clearOtherProfiles();
    // }

    followProfile = (akashaId, gas) => {
        this.props.profileFollow(akashaId, gas);
    }

    unfollowProfile = (akashaId, gas) => {
        this.props.profileUnfollow(akashaId, gas);
    }

    selectProfile = (address) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfile.get('akashaId');
        router.push(`/${loggedAkashaId}/profile/${address}`);
    }

    sendTip = (profileData) => {
        const { akashaId, firstName, lastName, profile } = profileData;
        this.props.profileSendTip({ akashaId, firstName, lastName, profile });
    };

    render () {
        const { profileData, followPending, followerList,
            loggedProfile, sendingTip } = this.props;
        const isFollower = followerList.get(profileData.akashaId);

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
              loggedProfile={loggedProfile}
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
    followPending: PropTypes.shape(),
    followerList: PropTypes.shape(),
    params: PropTypes.shape(),
    profileData: PropTypes.shape(),
    profileGetData: PropTypes.func,
    profileIsFollower: PropTypes.func,
    profileFollow: PropTypes.func,
    profileUnfollow: PropTypes.func,
    profileSendTip: PropTypes.func,
    loggedProfile: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
    match: PropTypes.shape()
};

ProfileContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const akashaId = ownProps.match.params.akashaId;
    return {
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        followerList: state.profileState.get('isFollower'),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        profileData: selectProfile(state, akashaId),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
    };
}


export default connect(
    mapStateToProps,
    {
        profileGetData,
        profileIsFollower,
        profileFollow,
        profileUnfollow,
        profileSendTip
    }
)(ProfileContainer);
