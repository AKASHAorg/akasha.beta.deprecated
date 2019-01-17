// @flow
import { List } from 'immutable';
/**
 * state slice selectors (see ./README.md)
 */

/*::
    type ProfileEthProps = {
        ethAddress: string
    }
    type ProfileFlagProps = {
        flag: string
    }
    type PendingProfileProps = {
        context: string
    }
 */
export const selectProfilesByEthAddress = (state/*: Object*/) => state.profileState.get('byEthAddress');

export const selectProfileByEthAddress = (state/*: Object*/, props/*: ProfileEthProps*/) =>
    state.profileState.getIn(['byEthAddress', props.ethAddress]);

export const selectLocalProfiles = (state/*: Object*/) => state.profileState.get('localProfiles');

export const selectLoggedProfile = (state/*: Object*/) => state.profileState.get('loggedProfile');

export const selectLoggedEthAddress = (state/*: Object*/)/*: string*/ =>
    selectLoggedProfile(state).get('ethAddress');

export const selectAllFollowings = (state/*: Object*/) => state.profileState.get('allFollowings');

export const selectProfileFlag = (state/*: Object*/, props/*: ProfileFlagProps */) =>
    state.profileState.getIn(['flags', props.flag]);

export const selectFollowers = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['followers', props.ethAddress]);

export const selectFollowings = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['followings', props.ethAddress]);

export const selectIsFollower = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['isFollower', props.ethAddress]);

export const selectLastFollower = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['lastFollower', props.ethAddress]);

export const selectLastFollowing = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['lastFollowing', props.ethAddress]);

export const selectMoreFollowers = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['moreFollowers', props.ethAddress]);

export const selectMoreFollowings = (state/*: Object*/, props/*: ProfileEthProps */) =>
    state.profileState.getIn(['moreFollowings', props.ethAddress]);

export const selectProfileExists = (state/*: Object*/) =>
    state.profileState.get('exists');

export const selectProfileInterests = (state/*: Object*/) =>
    state.profileState.get('interests');

export const selectEssenceIterator = (state/*: Object*/) =>
    state.profileState.get('essenceIterator');

export const selectEssenceEvents = (state/*: Object*/) =>
    state.profileState.get('essenceEvents');

export const selectCyclingStates = (state/*: Object*/) =>
    state.profileState.get('cyclingStates');

export const selectBalance = (state/*: Object*/) =>
    state.profileState.get('balance');

export const selectBurnedMana = (state/*: Object*/) =>
    state.profileState.get('manaBurned');

export const selectPublishingCost = (state/*: Object*/) =>
    state.profileState.get('publishingCost');

export const selectLoginErrors = (state/*: Object*/) =>
    state.profileState.get('loginErrors');

export const selectFaucet = (state/*: Object*/) =>
    state.profileState.get('faucet');

export const selectKarmaRanking = (state/*: Object*/) =>
    state.profileState.get('karmaRanking');

export const selectCanCreateTags = (state/*: Object*/) =>
    state.profileState.get('canCreateTags');

/**
 * 'getters' (see ./README.md)
 */
export const getLocalProfiles = (state/*: Object*/) =>
    selectLocalProfiles(state).map((ethAddress/*: string */) =>
        selectProfileByEthAddress(state, { ethAddress }));

export const getLoggedProfileData = (state/*: Object*/)/*: Object*/ =>
    selectProfileByEthAddress(state, { ethAddress: selectLoggedEthAddress(state) });

export const getFetchingFollowers = (state/*: Object*/, props/*: ProfileEthProps*/) =>
    selectProfileFlag(state, { flag: 'fetchingFollowers' }).get(props.ethAddress);

export const getFetchingFollowings = (state/*: Object*/, props/*: ProfileEthProps*/) =>
    selectProfileFlag(state, { flag: 'fetchingFollowings' }).get(props.ethAddress);

export const getFetchingMoreFollowers = (state/*: Object*/, props/*: ProfileEthProps*/) =>
    selectProfileFlag(state, { flag: 'fetchingMoreFollowers' }).get(props.ethAddress);

export const getFetchingMoreFollowings = (state/*: Object*/, props/*: ProfileEthProps*/) =>
    selectProfileFlag(state, { flag: 'fetchingMoreFollowings' }).get(props.ethAddress);

export const getFollowers = (state/*: Object*/, props/*: ProfileEthProps */) => {
    const followers = selectFollowers(state, { ethAddress: props.ethAddress });
    if(followers) {
        return followers.map(ethAddr => selectProfileByEthAddress(state, ethAddr))
    }
    return new List();
};
export const getFollowings = (state/*: Object*/, props/*: ProfileEthProps */) => {
    const followings = selectFollowings(state, { ethAddress: props.ethAddress });
    if (followings) {
        return followings.map(ethAddr => selectProfileByEthAddress(state, ethAddr));
    }
    return new List();
};
export const getFollowingsCounter = (state/*: Object*/, props/*: ProfileEthProps */) => {
    const following = selectFollowings(state, { ethAddress: props.ethAddress });
    return following ? following.size : null;
};
export const getFollowersCounter = (state/*: Object*/, props/*: ProfileEthProps */) => {
    const followers = selectFollowers(state, { ethAddress: props.ethAddress });
    return followers ? followers.size : null;
};
export const getPendingProfiles = (state/*: Object*/, props/*: PendingProfileProps*/) =>
    selectProfileFlag(state, { flag: 'pendingProfiles' }).get(props.context);

export const getToken = (state/*: Object*/) => selectLoggedProfile(state).get('token');

export const getTokenExpiration = (state/*: Object*/) => selectLoggedProfile(state).get('expiration');

export const getEssenceIterator = (state/*: Object*/) => ({
    lastBlock: selectEssenceIterator(state).get('lastBlock'),
    lastIndex: selectEssenceIterator(state).get('lastIndex')
});

export const getEthBalance = (state/*: Object*/) => selectBalance(state).get('eth');

export const getManaBalance = (state/*: Object*/) => selectBalance(state).getIn(['mana', 'remaining']);
