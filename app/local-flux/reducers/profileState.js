import { List, Map } from 'immutable';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { AethBalance, Balance, ErrorRecord, EssenceBalance, LoggedProfile, ManaBalance, ProfileRecord,
    ProfileState } from './records';
import { balanceToNumber } from '../../utils/number-formatter';

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

// const commentsIteratorHandler = (state, { data }) => {
//     let byId = state.get('byId');
//     data.collection.forEach((comm) => {
//         const publisher = comm.data.profile;
//         if (publisher && !byId.get(publisher.akashaId)) {
//             byId = addProfileData(byId, publisher);
//         }
//     });
//     return state.set('byId', byId);
// };

const profileState = createReducer(initialState, {

    // [types.COMMENTS_ITERATOR_SUCCESS]: commentsIteratorHandler,

    // [types.COMMENTS_MORE_ITERATOR_SUCCESS]: commentsIteratorHandler,

    [types.ENTRY_GET_FULL_SUCCESS]: (state, { request }) =>
        state.set('byId', addProfileData(state.get('byId'), { ethAddress: request.ethAddress })),

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

    [types.PROFILE_CYCLING_STATES_SUCCESS]: (state, { data }) => {
        return state.mergeIn(['cyclingStates'], data);
    },

    [types.PROFILE_DELETE_LOGGED_SUCCESS]: state =>
        state.set('loggedProfile', new LoggedProfile()),

    [types.PROFILE_FOLLOW_SUCCESS]: (state, { data }) => {
        const { ethAddress } = data;
        const loggedEthAddress = state.getIn(['loggedProfile', 'ethAddress']);
        const loggedProfile = state.getIn(['byEthAddress', loggedEthAddress]);
        const followingCount = loggedProfile.get('followingCount');
        const profile = state.getIn(['byEthAddress', ethAddress]);
        const oldFollowers = state.get('followers');
        const oldFollowings = state.get('followings');
        const followersList = oldFollowers.get(ethAddress);
        const followingsList = oldFollowings.get(loggedEthAddress);
        const followers = followersList ?
            oldFollowers.set(ethAddress, followersList.unshift(loggedEthAddress)) :
            oldFollowers;
        const followings = followingsList ?
            oldFollowings.set(loggedEthAddress, followingsList.unshift(ethAddress)) :
            oldFollowings;
        return state.merge({
            byEthAddress: state.get('byEthAddress').merge({
                [ethAddress]: profile ?
                    profile.set('followersCount', +profile.get('followersCount') + 1) :
                    undefined,
                [loggedEthAddress]: loggedProfile.set('followingCount', +followingCount + 1)
            }),
            followers,
            followings,
            isFollower: state.get('isFollower').set(ethAddress, true)
        });
    },

    [types.PROFILE_FOLLOWERS_ITERATOR]: (state, { ethAddress }) =>
        state.setIn(['flags', 'fetchingFollowers', ethAddress], true),

    [types.PROFILE_FOLLOWERS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingFollowers', request.ethAddress], false),

    [types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const moreFollowers = data.lastBlock > 0;
        let followersList = new List();
        const last = {
            lastIndex: data.lastIndex,
            lastBlock: data.lastBlock
        };
        data.collection.forEach((follower) => {
            followersList = followersList.push(follower.ethAddress);
        });

        return state.merge({
            flags: state.get('flags').setIn(['fetchingFollowers', request.ethAddress], false),
            followers: state.get('followers').set(request.ethAddress, followersList),
            lastFollower: state.get('lastFollower').set(request.ethAddress, last),
            moreFollowers: state.get('moreFollowers').set(request.ethAddress, moreFollowers)
        });
    },

    [types.PROFILE_FOLLOWINGS_ITERATOR]: (state, { ethAddress }) =>
        state.setIn(['flags', 'fetchingFollowings', ethAddress], true),

    [types.PROFILE_FOLLOWINGS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingFollowings', request.ethAddress], false),

    [types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const moreFollowings = data.lastBlock > 0;
        let followingsList = new List();
        const last = {
            lastIndex: data.lastIndex,
            lastBlock: data.lastBlock
        };
        data.collection.forEach((following) => {
            followingsList = followingsList.push(following.ethAddress);
        });

        return state.merge({
            flags: state.get('flags').setIn(['fetchingFollowings', request.ethAddress], false),
            followings: state.get('followings').set(request.ethAddress, followingsList),
            lastFollowing: state.get('lastFollowing').set(request.ethAddress, last),
            moreFollowings: state.get('moreFollowings').set(request.ethAddress, moreFollowings)
        });
    },

    [types.PROFILE_GET_BALANCE_SUCCESS]: (state, { data }) => {
        if (state.getIn(['loggedProfile', 'ethAddress']) !== data.etherBase) {
            return state;
        }
        const balance = new Balance().merge({
            aeth: new AethBalance(data.AETH),
            essence: new EssenceBalance(data.essence),
            eth: data.balance,
            mana: new ManaBalance(data.mana)
        });
        return state.set('balance', balance);
    },

    [types.PROFILE_GET_DATA_SUCCESS]: (state, { data }) =>
        state.set('byEthAddress', addProfileData(state.get('byEthAddress'), data)),

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

    [types.PROFILE_GET_LOGGED_SUCCESS]: (state, { data }) => {
        const { akashaId, ethAddress } = data;
        if (akashaId) {
            return state.set('loggedProfile', new LoggedProfile(data));
        }
        return state.merge({
            byEthAddress: state.get('byEthAddress').set(ethAddress, new ProfileRecord({ ethAddress })),
            loggedProfile: new LoggedProfile(data)
        });
    },

    [types.PROFILE_IS_FOLLOWER_SUCCESS]: (state, { data }) => {
        let isFollower = state.get('isFollower');
        data.collection.forEach((resp) => {
            const { addressFollowing, result } = resp;
            isFollower = isFollower.set(addressFollowing, result);
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

    [types.PROFILE_MANA_BURNED_SUCCESS]: (state, { data }) => {
        const comments = balanceToNumber(data.comments.manaCost);
        const entries = balanceToNumber(data.entries.manaCost);
        const votes = balanceToNumber(data.votes.manaCost);
        return state.mergeIn(['manaBurned'], { comments, entries, votes });
    },

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR]: (state, { ethAddress }) =>
        state.setIn(['flags', 'fetchingMoreFollowers', ethAddress], true),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingMoreFollowers', request.ethAddress], false),

    [types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const moreFollowers = data.lastBlock > 0;
        let followersList = state.getIn(['followers', request.ethAddress]) || new List();
        const last = {
            lastIndex: data.lastIndex,
            lastBlock: data.lastBlock
        };
        data.collection.forEach((follower) => {
            followersList = followersList.push(follower.ethAddress);
        });
        followersList = followersList.toSet().toList();
        return state.merge({
            flags: state.get('flags').setIn(['fetchingMoreFollowers', request.ethAddress], false),
            followers: state.get('followers').set(request.ethAddress, followersList),
            lastFollower: state.get('lastFollowing').set(request.ethAddress, last),
            moreFollowers: state.get('moreFollowers').set(request.ethAddress, moreFollowers)
        });
    },

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR]: (state, { ethAddress }) =>
        state.setIn(['flags', 'fetchingMoreFollowings', ethAddress], true),

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'fetchingMoreFollowings', request.ethAddress], false),

    [types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const moreFollowings = data.lastBlock > 0;
        let followingsList = state.getIn(['followings', request.ethAddress]) || new List();
        const last = {
            lastIndex: data.lastIndex,
            lastBlock: data.lastBlock
        };
        data.collection.forEach((following) => {
            followingsList = followingsList.push(following.ethAddress);
        });
        followingsList = followingsList.toSet().toList();
        return state.merge({
            flags: state.get('flags').setIn(['fetchingMoreFollowings', request.ethAddress], false),
            followings: state.get('followings').set(request.ethAddress, followingsList),
            lastFollowing: state.get('lastFollowing').set(request.ethAddress, last),
            moreFollowings: state.get('moreFollowings').set(request.ethAddress, moreFollowings)
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
        const { ethAddress } = data;
        const loggedEthAddress = state.getIn(['loggedProfile', 'ethAddress']);
        const loggedProfile = state.getIn(['byEthAddress', loggedEthAddress]);
        const followingCount = loggedProfile.get('followingCount');
        const profile = state.getIn(['byEthAddress', ethAddress]);
        const oldFollowers = state.get('followers');
        const oldFollowings = state.get('followings');
        const followersList = oldFollowers.get(ethAddress);
        const followingsList = oldFollowings.get(loggedEthAddress);
        const followers = followersList ?
            oldFollowers.set(ethAddress, followersList.filter(id => id !== loggedEthAddress)) :
            oldFollowers;
        const followings = followingsList ?
            oldFollowings.set(loggedEthAddress, followingsList.filter(id => id !== ethAddress)) :
            oldFollowings;
        return state.merge({
            byEthAddress: state.get('byEthAddress').merge({
                [ethAddress]: profile ?
                    profile.set('followersCount', +profile.get('followersCount') - 1) :
                    undefined,
                [loggedEthAddress]: loggedProfile.set('followingCount', +followingCount - 1)
            }),
            followers,
            followings,
            isFollower: state.get('isFollower').set(ethAddress, false)
        });
    },

});

export default profileState;
