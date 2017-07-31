import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { profileGetData, profileIsFollower, profileAddFollowAction,
     profileAddUnfollowAction, profileAddTipAction } from '../local-flux/actions/profile-actions';
import { entryProfileIterator, entryMoreProfileIterator } from '../local-flux/actions/entry-actions';
import { DataLoader, ProfileActivity, ProfileDetails } from '../components';
import { selectProfile, selectProfileEntries } from '../local-flux/selectors';

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
        const payload = { akashaId, gas };
        this.props.profileAddFollowAction(payload);
    }

    unfollowProfile = (akashaId, gas) => {
        const payload = { akashaId, gas };
        this.props.profileAddUnfollowAction(payload);
    }

    sendTip = (profileData) => {
        const { akashaId, firstName, lastName, profile } = profileData;
        const payload = { akashaId, firstName, lastName, profile };
        this.props.profileAddTipAction(payload);
    };

    render () {
        const { profileData, profileEntries, followPending, followerList, moreProfileEntries,
            fetchingMoreProfileEntries, fetchingProfileEntries, loggedProfile, sendingTip, profiles } = this.props;
        const isFollower = followerList.get(profileData.akashaId);

        return (<DataLoader
          flag={!profileData}
          timeout={300}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
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

            <ProfileActivity
              akashaId={profileData.akashaId}
              entryProfileIterator={this.props.entryProfileIterator}
              entryMoreProfileIterator={this.props.entryMoreProfileIterator}
              profileEntries={profileEntries}
              profiles={profiles}
              fetchingProfileEntries={fetchingProfileEntries}
              fetchingMoreProfileEntries={fetchingMoreProfileEntries}
              firstName={profileData.firstName}
              moreProfileEntries={moreProfileEntries}
            />
          </div>
        </DataLoader>);
    }
}

ProfileContainer.propTypes = {
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    followPending: PropTypes.shape(),
    followerList: PropTypes.shape(),
    fetchingMoreProfileEntries: PropTypes.bool,
    fetchingProfileEntries: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
    params: PropTypes.shape(),
    profileData: PropTypes.shape(),
    profileEntries: PropTypes.shape(),
    profileGetData: PropTypes.func,
    profileIsFollower: PropTypes.func,
    profileAddFollowAction: PropTypes.func,
    profileAddUnfollowAction: PropTypes.func,
    profileAddTipAction: PropTypes.func,
    profiles: PropTypes.shape(),
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
        fetchingMoreProfileEntries: state.entryState.getIn(['flags', 'fetchingMoreProfileEntries']),
        fetchingProfileEntries: state.entryState.getIn(['flags', 'fetchingProfileEntries']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        followerList: state.profileState.get('isFollower'),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        profileData: selectProfile(state, akashaId),
        profileEntries: selectProfileEntries(state, akashaId),
        profiles: state.profileState.get('byId'),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
    };
}


export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator,
        profileGetData,
        profileIsFollower,
        profileAddFollowAction,
        profileAddUnfollowAction,
        profileAddTipAction
    }
)(ProfileContainer);
