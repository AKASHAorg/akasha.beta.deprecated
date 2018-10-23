// @flow
import { createSelector } from 'reselect';
import { List } from 'immutable';
import { ProfileRecord } from '../reducers/records/profile-record';

/**
 * state slice selectors (see ./README.md)
 */
export const selectProfileByEthAddress = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['byEthAddress', ethAddress]);

export const selectLocalProfiles = (state/*: Object*/) => state.profileState.get('localProfiles');

export const selectLoggedProfile = (state/*: Object*/) => state.profileState.get('loggedProfile');

export const selectLoggedEthAddress = (state/*: Object*/)/*: string*/ =>
    selectLoggedProfile(state).get('ethAddress');

export const selectAllFollowings = (state/*: Object*/) => state.profileState.get('allFollowings');

export const selectProfileFlag = (state/*: Object*/, flag/*: string*/) =>
    state.profileState.getIn(['flags', flag]);

export const selectFollowers = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['followers', ethAddress]);

export const selectFollowings = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['followings', ethAddress]);

export const selectIsFollower = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['isFollower', ethAddress]);

export const selectLastFollower = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['lastFollower', ethAddress]);

export const selectLastFollowing = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['lastFollowing', ethAddress]);

export const selectMoreFollowers = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['moreFollowers', ethAddress]);

export const selectMoreFollowings = (state/*: Object*/, ethAddress/*: string*/) =>
    state.profileState.getIn(['moreFollowings', ethAddress]);

export const selectProfileExists = (state/*: Object*/) =>
    state.profileState.get('exists');

export const selectEssenceIterator = (state/*: Object*/) =>
    state.profileState.get('essenceIterator');

export const selectCyclingStates = (state/*: Object*/) =>
    state.profileState.get('cyclingStates');

export const selectBalance = (state/*: Object*/) =>
    state.profileState.get('balance');

export const selectBurnedMana = (state/*: Object*/) =>
    state.profileState.get('manaBurned');

export const selectPublishingCost = (state/*: Object*/) =>
    state.profileState.get('publishingCost');

/**
 * 'getters' (see ./README.md)
 */
export const getLocalProfiles = (state/*: Object*/) =>
    selectLocalProfiles(state).map(ethAddress => selectProfileByEthAddress(state, ethAddress));

export const getLoggedProfileData = (state/*: Object*/)/*: Object*/ =>
    selectProfileByEthAddress(state, selectLoggedEthAddress(state));

export const getFetchingFollowers = (state/*: Object*/, ethAddress/*: string*/) =>
    selectProfileFlag(state, 'fetchingFollowers').get(ethAddress);

export const getFetchingFollowings = (state/*: Object*/, ethAddress/*: string*/) =>
    selectProfileFlag(state, 'fetchingFollowings').get(ethAddress);

export const getFetchingMoreFollowers = (state/*: Object*/, ethAddress/*: string*/) =>
    selectProfileFlag(state, 'fetchingMoreFollowers').get(ethAddress);

export const getFetchingMoreFollowings = (state/*: Object*/, ethAddress/*: string*/) =>
    selectProfileFlag(state, 'fetchingMoreFollowings').get(ethAddress);

export const getFollowers = (state/*: Object*/, ethAddress/*: string*/) => {
    const followers = selectFollowers(state, ethAddress);
    if(followers) {
        return followers.map(ethAddr => selectProfileByEthAddress(state, ethAddr))
    }
    return new List();
};
export const getFollowings = (state/*: Object*/, ethAddress/*: string*/) => {
    const followings = selectFollowings(state, ethAddress);
    if (followings) {
        return followings.map(ethAddr => selectProfileByEthAddress(state, ethAddr));
    }
    return new List();
};
export const getFollowingsCounter = (state/*: Object*/, ethAddress/*: string*/) => {
    const following = selectFollowings(state, ethAddress);
    return following ? following.size : null;
};
export const getFollowersCounter = (state/*: Object*/, ethAddress/*: string*/) => {
    const followers = selectFollowers(state, ethAddress);
    return followers ? followers.size : null;
};
export const getPendingProfiles = (state/*: Object*/, context/*: string*/) =>
    selectProfileFlag(state, 'pendingProfiles').get(context);

export const getToken = (state/*: Object*/) => selectLoggedProfile(state).get('token');

export const getTokenExpiration = (state/*: Object*/) => selectLoggedProfile(state).get('expiration');

export const getEssenceIterator = (state/*: Object*/) => {
    return {
        lastBlock: selectEssenceIterator(state).get('lastBlock'),
        lastIndex: selectEssenceIterator(state).get('lastIndex')
    };
};

export const getEthBalance = (state/*: Object*/) => selectBalance(state).get('eth');

export const getManaBalance = (state/*: Object*/) => selectBalance(state).getIn(['mana', 'remaining']);
