import { createSelector } from 'reselect';
import { List } from 'immutable';
import { ProfileRecord } from '../reducers/records/profile-record';

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .map(ethAddress => selectProfile(state, ethAddress));

export const selectLoggedEthAddress = state =>
    state.profileState.getIn(['loggedProfile', 'ethAddress']);

export const selectLoggedProfile = state => state.profileState.get('loggedProfile');

export const selectLoggedProfileData = state =>
    selectProfile(state, state.profileState.getIn(['loggedProfile', 'ethAddress']));

export const selectAllFollowings = state => state.profileState.get('allFollowings');

export const selectFetchingFollowers = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingFollowers', ethAddress]);

export const selectFetchingFollowings = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingFollowings', ethAddress]);


export const selectFetchingMoreFollowers = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingMoreFollowers', ethAddress]);

export const selectFetchingMoreFollowings = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingMoreFollowings', ethAddress]);

export const selectFollowers = (state, ethAddress) => {
    const followers = state.profileState.getIn(['followers', ethAddress]);
    if (followers) {
        return followers.map(ethAddr => selectProfile(state, ethAddr));
    }
    return new List();
};

export const selectFollowings = (state, ethAddress) => {
    const followings = state.profileState.getIn(['followings', ethAddress]);
    if (followings) {
        return followings.map(ethAddr => selectProfile(state, ethAddr));
    }
    return new List();
};
export const selectIsFollower = (state, ethAddress) => state.profileState.getIn(['isFollower', ethAddress]);

export const selectLastFollower = (state, ethAddress) =>
    state.profileState.getIn(['lastFollower', ethAddress]);

export const selectLastFollowing = (state, ethAddress) =>
    state.profileState.getIn(['lastFollowing', ethAddress]);

export const selectCurrentTotalFollowing = (state, ethAddress) => {
    const following = state.profileState.getIn(['followings', ethAddress]);
    return following ? following.size : null;
};

export const selectCurrentTotalFollowers = (state, ethAddress) => {
    const followers = state.profileState.getIn(['followers', ethAddress]);
    return followers ? followers.size : null;
};

export const selectMoreFollowers = (state, ethAddress) =>
    state.profileState.getIn(['moreFollowers', ethAddress]);

export const selectMoreFollowings = (state, ethAddress) =>
    state.profileState.getIn(['moreFollowings', ethAddress]);

export const selectProfile = (state, ethAddress) =>
    state.profileState.getIn(['byEthAddress', ethAddress]) || new ProfileRecord();

export const selectPendingProfiles = (state, context) =>
    state.profileState.getIn(['flags', 'pendingProfiles', context]);

export const selectProfileExists = state => state.profileState.get('exists');

export const selectProfileFlag = (state, flag) => state.profileState.getIn(['flags', flag]);

export const selectToken = state => state.profileState.getIn(['loggedProfile', 'token']);

export const selectTokenExpiration = state => state.profileState.getIn(['loggedProfile', 'expiration']);

export const selectEssenceIterator = (state) => {
    return {
        lastBlock: state.profileState.getIn(['essenceIterator', 'lastBlock']),
        lastIndex: state.profileState.getIn(['essenceIterator', 'lastIndex'])
    };
};

export const selectCyclingStates = state => state.profileState.get('cyclingStates');

export const selectEthBalance = state => state.profileState.getIn(['balance', 'eth']);

export const selectManaBalance = state => state.profileState.getIn(['balance', 'mana', 'remaining']);

export const selectManaBurned = state => state.profileState.get('manaBurned');

export const selectBalance = state => state.profileState.get('balance');
