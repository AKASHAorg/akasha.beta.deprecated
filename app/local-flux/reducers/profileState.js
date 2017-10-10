import { List, Map } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { ErrorRecord, LoggedProfile, ProfileRecord, ProfileState } from './records';

const initialState = new ProfileState();

const addProfileData = (byEthAddress, { ...profileData }) => {
    if (!profileData) {
        return byEthAddress;
    }
    profileData.followersCount = Number(profileData.followersCount);
    profileData.followingCount = Number(profileData.followingCount);
    const { avatar, baseUrl } = profileData;
    if (avatar && baseUrl && !avatar.includes(baseUrl)) {
        profileData.avatar = `${baseUrl}/${avatar}`;
    }
    return byEthAddress.set(profileData.ethAddress, new ProfileRecord(profileData));
};

const commentsIteratorHandler = (state, { data }) => {
    let byId = state.get('byId');
    data.collection.forEach((comm) => {
        const publisher = comm.data.profile;
        if (publisher && !byId.get(publisher.akashaId)) {
            byId = addProfileData(byId, publisher);
        }
    });
    return state.set('byId', byId);
};

const getLastIndex = (collection) => {
    if (collection.length) {
        return collection[collection.length - 1].index;
    }
    return 0;
};

const profileState = createReducer(initialState, {

    [types.COMMENTS_ITERATOR_SUCCESS]: commentsIteratorHandler,

    [types.COMMENTS_MORE_ITERATOR_SUCCESS]: commentsIteratorHandler,

    [types.ENTRY_GET_FULL_SUCCESS]: (state, { data }) => {
        const { publisher } = data.entryEth;
        if (!publisher) {
            return state;
        }
        return state.set('byId', addProfileData(state.get('byId'), publisher));
    },

    [types.PROFILE_CLEAR_LOCAL]: state =>
        state.merge({
            localProfiles: new List()
        }),

    [types.PROFILE_CLEAR_LOGIN_ERRORS]: state =>
        state.set('loginErrors', new List()),

    [types.PROFILE_CREATE_ETH_ADDRESS]: state =>
        state.setIn(['flags', 'ethAddressPending'], true),

    [types.PROFILE_CREATE_ETH_ADDRESS_ERROR]: state =>
        state.setIn(['flags', 'ethAddressPending'], false),

    [types.PROFILE_CREATE_ETH_ADDRESS_SUCCESS]: state =>
        state.setIn(['flags', 'ethAddressPending'], false),

    [types.PROFILE_DELETE_LOGGED_SUCCESS]: state =>
        state.set('loggedProfile', new LoggedProfile()),

    [types.PROFILE_FOLLOW_SUCCESS]: (state, { data }) => {
        const { akashaId } = data;
        const loggedAkashaId = state.getIn(['loggedProfile', 'akashaId']);
        const loggedProfile = state.getIn(['byId', loggedAkashaId]);
        const followingCount = loggedProfile.get('followingCount');
        const profile = state.getIn(['byId', akashaId]);
        const oldFollowers = state.get('followers');
        const oldFollowings = state.get('followings');
        const followersList = oldFollowers.get(akashaId);
        const followingsList = oldFollowings.get(loggedAkashaId);
        const followers = followersList ?
            oldFollowers.set(akashaId, followersList.unshift(loggedAkashaId)) :
            oldFollowers;
        const followings = followingsList ?
            oldFollowings.set(loggedAkashaId, followingsList.unshift(akashaId)) :
            oldFollowings;
        return state.merge({
            byId: state.get('byId').merge({
                [akashaId]: profile ?
                    profile.set('followersCount', +profile.get('followersCount') + 1) :
                    undefined,
                [loggedAkashaId]: loggedProfile.set('followingCount', +followingCount + 1)
            }),
            followers,
            followings,
            isFollower: state.get('isFollower').set(akashaId, true)
        });
    },

    [types.PROFILE_FOLLOWERS_ITERATOR]: (state, { akashaId }) =>
        state.setIn(['flags', 'fetchingFollowers', akashaId], true),

    [types.PROFILE_FOLLOWERS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingFollowers', request.akashaId], false),

    [types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS]: (state, { data }) => {
        const moreFollowers = data.limit === data.collection.length;
        let byId = state.get('byId');
        let followersList = new List();
        const lastIndex = getLastIndex(data.collection);
        data.collection.forEach((follower, index) => {
            if (!moreFollowers || index !== (data.collection.length - 1)) {
                followersList = followersList.push(follower.profile.akashaId);
                byId = addProfileData(byId, follower.profile);
            }
        });

        return state.merge({
            byId,
            flags: state.get('flags').setIn(['fetchingFollowers', data.akashaId], false),
            followers: state.get('followers').set(data.akashaId, followersList),
            lastFollower: state.get('lastFollower').set(data.akashaId, lastIndex),
            moreFollowers: state.get('moreFollowers').set(data.akashaId, moreFollowers)
        });
    },

    [types.PROFILE_FOLLOWINGS_ITERATOR]: (state, { akashaId }) =>
        state.setIn(['flags', 'fetchingFollowings', akashaId], true),

    [types.PROFILE_FOLLOWINGS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingFollowings', request.akashaId], false),

    [types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS]: (state, { data }) => {
        const moreFollowings = data.limit === data.collection.length;
        let byId = state.get('byId');
        let followingsList = new List();
        const lastIndex = getLastIndex(data.collection);
        data.collection.forEach((following, index) => {
            if (!moreFollowings || index !== (data.collection.length - 1)) {
                followingsList = followingsList.push(following.profile.akashaId);
                byId = addProfileData(byId, following.profile);
            }
        });

        return state.merge({
            byId,
            flags: state.get('flags').setIn(['fetchingFollowings', data.akashaId], false),
            followings: state.get('followings').set(data.akashaId, followingsList),
            lastFollowing: state.get('lastFollowing').set(data.akashaId, lastIndex),
            moreFollowings: state.get('moreFollowings').set(data.akashaId, moreFollowings)
        });
    },

    [types.PROFILE_GET_BALANCE_SUCCESS]: (state, { data }) => {
        if (state.getIn(['loggedProfile', 'ethAddress']) !== data.etherBase) {
            return state;
        }
        return state.set('balance', data.balance);
    },

    [types.PROFILE_GET_DATA]: state =>
        state.setIn(['flags', 'fetchingProfileData'], true),

    [types.PROFILE_GET_DATA_ERROR]: state =>
        state.setIn(['flags', 'fetchingProfileData'], false),

    [types.PROFILE_GET_DATA_SUCCESS]: (state, { data }) =>
        state.merge({
            byEthAddress: addProfileData(state.get('byEthAddress'), data),
            flags: state.get('flags').set('fetchingProfileData', false)
        }),

    [types.PROFILE_GET_LIST]: (state, { akashaIds }) => {
        let pendingListProfiles = state.getIn(['flags', 'pendingListProfiles']);
        akashaIds.forEach((item) => {
            pendingListProfiles = pendingListProfiles.set(item.akashaId, true);
        });
        return state.setIn(['flags', 'pendingListProfiles'], pendingListProfiles);
    },

    [types.PROFILE_GET_LIST_SUCCESS]: (state, { data }) => {
        if (data.done) {
            return state;
        }
        return state.merge({
            byEthAddress: addProfileData(state.get('byEthAddress'), data),
            flags: state.get('flags').setIn(['pendingListProfiles', data.akashaId], false)
        });
    },

    [types.PROFILE_GET_LOCAL]: state =>
        state.mergeIn(['flags'], {
            fetchingLocalProfiles: true,
            localProfilesFetched: false
        }),

    [types.PROFILE_GET_LOCAL_ERROR]: state =>
        state.mergeIn(['flags'], {
            fetchingLocalProfiles: false,
            localProfilesFetched: true
        }),

    [types.PROFILE_GET_LOCAL_SUCCESS]: (state, { data }) => {
        let localProfiles = new List();
        let byEthAddress = state.get('byEthAddress');
        data.forEach((prf) => {
            byEthAddress = byEthAddress.set(prf.ethAddress, new ProfileRecord(prf));
            localProfiles = localProfiles.push(prf.ethAddress);
        });
        return state.merge({
            byEthAddress,
            flags: state.get('flags').merge({
                fetchingLocalProfiles: false,
                localProfilesFetched: true
            }),
            localProfiles
        });
    },

    [types.PROFILE_GET_LOGGED_SUCCESS]: (state, { data }) =>
        state.set('loggedProfile', new LoggedProfile(data)),

    [types.PROFILE_IS_FOLLOWER_SUCCESS]: (state, { data }) => {
        let isFollower = state.get('isFollower');
        data.collection.forEach((resp) => {
            isFollower = isFollower.set(resp.following, resp.result);
        });
        return state.set('isFollower', isFollower);
    },

    [types.PROFILE_LOGIN]: state =>
        state.setIn(['flags', 'loginPending'], true),

    [types.PROFILE_LOGIN_ERROR]: (state, { error }) =>
        state.merge({
            flags: state.get('flags').set('loginPending', false),
            loginErrors: state.get('loginErrors').push(new ErrorRecord(error))
        }),

    [types.PROFILE_LOGIN_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').set('loginPending', false),
            loggedProfile: state.get('loggedProfile').merge(data)
        }),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR]: (state, { akashaId }) =>
        state.setIn(['flags', 'fetchingMoreFollowers', akashaId], true),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingMoreFollowers', request.akashaId], false),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS]: (state, { data }) => {
        const moreFollowers = data.limit === data.collection.length;
        let byId = state.get('byId');
        let followersList = state.getIn(['followers', data.akashaId]) || new List();
        const lastIndex = getLastIndex(data.collection);
        data.collection.forEach((follower, index) => {
            if (!moreFollowers || index !== (data.collection.length - 1)) {
                followersList = followersList.push(follower.profile.akashaId);
                byId = addProfileData(byId, follower.profile);
            }
        });

        return state.merge({
            byId,
            flags: state.get('flags').setIn(['fetchingMoreFollowers', data.akashaId], false),
            followers: state.get('followers').set(data.akashaId, followersList),
            lastFollower: state.get('lastFollowing').set(data.akashaId, lastIndex),
            moreFollowers: state.get('moreFollowers').set(data.akashaId, moreFollowers)
        });
    },

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR]: (state, { akashaId }) =>
        state.setIn(['flags', 'fetchingMoreFollowings', akashaId], true),

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingMoreFollowings', request.akashaId], false),

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS]: (state, { data }) => {
        const moreFollowings = data.limit === data.collection.length;
        let byId = state.get('byId');
        let followingsList = state.getIn(['followings', data.akashaId]) || new List();
        const lastIndex = getLastIndex(data.collection);
        data.collection.forEach((following, index) => {
            if (!moreFollowings || index !== (data.collection.length - 1)) {
                followingsList = followingsList.push(following.profile.akashaId);
                byId = addProfileData(byId, following.profile);
            }
        });

        return state.merge({
            byId,
            flags: state.get('flags').setIn(['fetchingMoreFollowings', data.akashaId], false),
            followings: state.get('followings').set(data.akashaId, followingsList),
            lastFollowing: state.get('lastFollowing').set(data.akashaId, lastIndex),
            moreFollowings: state.get('moreFollowings').set(data.akashaId, moreFollowings)
        });
    },

    [types.PROFILE_RESOLVE_IPFS_HASH]: (state, { ipfsHash, columnId }) => {
        let newHashes = new Map();
        ipfsHash.forEach((hash) => { newHashes = newHashes.set(hash, true); });
        return state.mergeIn(['flags', 'resolvingIpfsHash', columnId], newHashes);
    },

    [types.PROFILE_RESOLVE_IPFS_HASH_ERROR]: (state, { error, req }) =>
        state.setIn(['flags', 'resolvingIpfsHash', req.columnId, error.ipfsHash], false),

    [types.PROFILE_RESOLVE_IPFS_HASH_SUCCESS]: (state, { data, req }) => {
        const index = req.ipfsHash.indexOf(data.ipfsHash);
        const akashaId = req.akashaIds[index];
        return state.merge({
            flags: state.get('flags').setIn(['resolvingIpfsHash', req.columnId, data.ipfsHash], false),
            byId: state.get('byId').mergeIn([akashaId], data.profile)
        });
    },

    [types.PROFILE_TOGGLE_INTEREST]: (state, { interest, interestType }) => {
        const interestState = state.getIn(['interests', interestType]);
        const newList = interestState.includes(interest) ?
            interestState.delete(interestState.indexOf(interest)) :
            interestState.push(interest);
        return state.setIn(['interests', interestType], newList);
    },

    [types.PROFILE_UNFOLLOW_SUCCESS]: (state, { data }) => {
        const { akashaId } = data;
        const loggedAkashaId = state.getIn(['loggedProfile', 'akashaId']);
        const loggedProfile = state.getIn(['byId', loggedAkashaId]);
        const followingCount = loggedProfile.get('followingCount');
        const profile = state.getIn(['byId', akashaId]);
        const oldFollowers = state.get('followers');
        const oldFollowings = state.get('followings');
        const followersList = oldFollowers.get(akashaId);
        const followingsList = oldFollowings.get(loggedAkashaId);
        const followers = followersList ?
            oldFollowers.set(akashaId, followersList.filter(id => id !== loggedAkashaId)) :
            oldFollowers;
        const followings = followingsList ?
            oldFollowings.set(loggedAkashaId, followingsList.filter(id => id !== akashaId)) :
            oldFollowings;
        return state.merge({
            byId: state.get('byId').merge({
                [akashaId]: profile ?
                    profile.set('followersCount', +profile.get('followersCount') - 1) :
                    undefined,
                [loggedAkashaId]: loggedProfile.set('followingCount', +followingCount - 1)
            }),
            followers,
            followings,
            isFollower: state.get('isFollower').set(akashaId, false)
        });
    },

});

export default profileState;
