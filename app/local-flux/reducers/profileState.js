import { List, Map, Record, Collection, fromJS } from 'immutable';
import * as types from '../constants';
import * as actionTypes from '../../constants/action-types';
import { createReducer } from './create-reducer';
import {
    AethBalance,
    Balance,
    ErrorRecord,
    EssenceBalance,
    LoggedProfile,
    ManaBalance,
    ProfileExistsRecord,
    ProfileRecord,
    ProfileState
} from './records';
import { balanceToNumber } from '../../utils/number-formatter';

const initialState = new ProfileState();

const EssenceEvent = Record({
    amount: null,
    action: '',
    sourceId: '',
    blockNumber: null
});
const EssenceIterator = Record({ lastBlock: null, lastIndex: null });
const addProfileData = (byEthAddress, { ...profileData }, full) => {
    if (!profileData) {
        return byEthAddress;
    }
    profileData.followersCount = Number(profileData.followersCount);
    profileData.followingCount = Number(profileData.followingCount);

    const oldProfile = byEthAddress.get(profileData.ethAddress);
    if (!full && oldProfile) {
        profileData.backgroundImage = oldProfile.get('backgroundImage');
        profileData.links = oldProfile.get('links');
    }
    return byEthAddress.set(profileData.ethAddress, new ProfileRecord(profileData));
};

const getKarmaPopoverDefaultState = (collection, myRanking) => {
    let defaultState = [];
    if (collection.length < 4) {
        return collection;
    }
    if (collection.length) {
        if (myRanking === 0) {
            defaultState = collection.slice(myRanking, myRanking + 3);
        } else if (myRanking === collection.length - 1) {
            defaultState = collection.slice(myRanking - 2);
        } else {
            defaultState = collection.slice(myRanking - 1, myRanking + 2);
        }
    }
    return defaultState;
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
    [types.ACTION_ADD]: (state, { actionType }) => {
        if (actionType === actionTypes.faucet) {
            return state.set('faucet', 'requested');
        }
        return state;
    },
    [types.ENTRY_GET_FULL_SUCCESS]: (state, { request }) =>
        state.set('byId', addProfileData(state.get('byId'), { ethAddress: request.ethAddress })),

    [types.PROFILE_ALL_FOLLOWINGS]: (state, { following }) =>
        state.set('allFollowings', following),

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

    [types.PROFILE_ESSENCE_ITERATOR]: (state) => {
        const flag = state.getIn(['essenceIterator', 'lastIndex']) ?
            'fetchingMoreEssenceIterator' :
            'fetchingEssenceIterator';
        return state.setIn(['flags', flag], true);
    },

    [types.PROFILE_ESSENCE_ITERATOR_ERROR]: (state, { request }) => {
        const flag = request.lastIndex ?
            'fetchingMoreEssenceIterator' :
            'fetchingEssenceIterator';
        return state.setIn(['flags', flag], false);
    },

    [types.PROFILE_ESSENCE_ITERATOR_SUCCESS]: (state, { data, request }) => {
        let latestIterable = new List();
        const essenceEvents = state.get('essenceEvents');
        data.collection.forEach((event) => {
            const newEssenceRecord = new EssenceEvent({
                amount: balanceToNumber(event.amount),
                action: event.action,
                sourceId: event.sourceId,
                blockNumber: event.blockNumber
            });

            if (!essenceEvents.includes(newEssenceRecord)) {
                latestIterable = latestIterable.push(newEssenceRecord);
            }
        });

        const latestSet = Collection.Set(latestIterable);
        latestIterable = essenceEvents.concat(latestSet);
        const flag = request.lastIndex ? 'fetchingMoreEssenceIterator' : 'fetchingEssenceIterator';

        return state.merge({
            essenceEvents: latestIterable,
            flags: state.get('flags').set(flag, false),
            essenceIterator: new EssenceIterator({ lastBlock: data.lastBlock, lastIndex: data.lastIndex })
        });
    },

    [types.PROFILE_EXISTS_SUCCESS]: (state, { data }) =>
        state.merge({
            exists: state.get('exists').merge({
                akashaId: data.akashaId,
                data: new ProfileExistsRecord(data)
            })
        }),
    [types.PROFILE_FAUCET]: state => state.set('faucet', 'requested'),
    [types.PROFILE_FAUCET_ERROR]: state => state.set('faucet', 'error'),

    [types.PROFILE_FAUCET_SUCCESS]: state => state.set('faucet', 'success'),
    [types.PROFILE_RESET_FAUCET]: state => state.set('faucet', null),
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
        const allFollowings = state.get('allFollowings');
        if (allFollowings.indexOf(ethAddress) === -1) {
            allFollowings.push(ethAddress);
        }
        return state.merge({
            allFollowings,
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
        const loggedEthAddress = state.getIn(['loggedProfile', 'ethAddress']);
        if (loggedEthAddress !== data.etherBase) {
            return state;
        }
        const balance = new Balance().merge({
            aeth: new AethBalance(data.AETH),
            essence: new EssenceBalance(data.essence),
            eth: data.balance,
            mana: new ManaBalance(data.mana)
        });
        return state.merge({
            balance,
            byEthAddress: state.get('byEthAddress').mergeIn([loggedEthAddress], {
                essence: data.essence.total,
                karma: data.karma.total
            })
        });
    },

    [types.PROFILE_GET_DATA]: (state, { context, akashaId, ethAddress }) => {
        const flags = context ?
            state.get('flags').setIn(['pendingProfiles', context, ethAddress], true) :
            state.get('flags');
        const byEthAddress = state.get('byEthAddress');
        if (byEthAddress.get(ethAddress)) {
            return state.set('flags', flags);
        }
        return state.merge({
            byEthAddress: byEthAddress.set(ethAddress, new ProfileRecord({ akashaId, ethAddress })),
            flags
        });
    },

    [types.PROFILE_GET_DATA_ERROR]: (state, { request }) => {
        const { context, ethAddress } = request;
        if (!context) {
            return state;
        }
        return state.setIn(['flags', 'pendingProfiles', context, ethAddress], false);
    },

    [types.PROFILE_GET_DATA_SUCCESS]: (state, { data, request }) => {
        const { context, ethAddress, full } = request;
        if (!context) {
            return state.set('byEthAddress', addProfileData(state.get('byEthAddress'), data, full));
        }
        return state.merge({
            byEthAddress: addProfileData(state.get('byEthAddress'), data, full),
            flags: state.get('flags').setIn(['pendingProfiles', context, ethAddress], false)
        });
    },

    [types.PROFILE_GET_LIST]: (state, { ethAddresses }) => {
        let pendingListProfiles = state.getIn(['flags', 'pendingListProfiles']);
        ethAddresses.forEach((item) => {
            pendingListProfiles = pendingListProfiles.set(item.ethAddress, true);
        });
        return state.setIn(['flags', 'pendingListProfiles'], pendingListProfiles);
    },

    [types.PROFILE_GET_LIST_SUCCESS]: (state, { data }) => {
        if (data.done) {
            return state;
        }
        return state.merge({
            byEthAddress: addProfileData(state.get('byEthAddress'), data),
            flags: state.get('flags').setIn(['pendingListProfiles', data.ethAddress], false)
        });
    },

    [types.PROFILE_GET_LOCAL]: (state, { polling }) => {
        if (polling) {
            return state;
        }
        return state.mergeIn(['flags'], {
            fetchingLocalProfiles: true,
            localProfilesFetched: false
        });
    },

    [types.PROFILE_GET_LOCAL_ERROR]: (state, { request }) => {
        if (request.polling) {
            return state;
        }
        return state.mergeIn(['flags'], {
            fetchingLocalProfiles: false,
            localProfilesFetched: true
        });
    },

    [types.PROFILE_GET_LOCAL_SUCCESS]: (state, { data, request }) => {
        let byEthAddress = state.get('byEthAddress');
        if (!request.polling) {
            let localProfiles = new List();
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
        }
        let localProfiles = state.get('localProfiles');
        data.forEach((prf) => {
            if (!localProfiles.includes(prf.ethAddress)) {
                byEthAddress = byEthAddress.set(prf.ethAddress, new ProfileRecord(prf));
                localProfiles = localProfiles.push(prf.ethAddress);
            }
        });
        const ethAddresses = data.map(prf => prf.ethAddress);
        localProfiles = localProfiles.filter(ethAddress => ethAddresses.includes(ethAddress));
        return state.merge({
            byEthAddress,
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

    [types.PROFILE_GET_PUBLISHING_COST_SUCCESS]: (state, { data }) =>
        state.set('publishingCost', fromJS(data)),

    [types.PROFILE_IS_FOLLOWER_SUCCESS]: (state, { data }) => {
        let isFollower = state.get('isFollower');
        data.collection.forEach((resp) => {
            const { addressFollowing, result } = resp;
            isFollower = isFollower.set(addressFollowing, result);
        });
        return state.set('isFollower', isFollower);
    },

    [types.PROFILE_KARMA_RANKING]: state =>
        state.merge({
            flags: state.get('flags').set('karmaRankingPending', true),
            karmaRanking: new Map()
        }),

    [types.PROFILE_KARMA_RANKING_LOAD_MORE]: (state, { data }) => {
        const collection = state.getIn(['karmaRanking', 'collection']);
        let above = state.getIn(['karmaRanking', 'above']);
        const below = state.getIn(['karmaRanking', 'below']);
        if (data === 'above') {
            const first = (above[0] && (above[0].rank - 3) > -1) ?
                above[0].rank - 3 :
                collection[0].rank;
            const newAbove = collection.slice(first, first + 1);
            if (above[0] && above[0].rank !== newAbove[0].rank) {
                above = newAbove.concat(above);
            }
            return state.setIn(['karmaRanking', 'above'], above);
        }
        if (data === 'below' && below.length) {
            const last = below[below.length - 1].rank;
            const newBelow = (last && last === collection[collection.length - 1].rank) ?
                below : below.concat(collection.slice(last + 1, last + 5));
            return state.setIn(['karmaRanking', 'below'], newBelow);
        }
        return state;
    },

    [types.PROFILE_KARMA_RANKING_SUCCESS]: (state, { data }) => {
        const defaultState = getKarmaPopoverDefaultState(data.collection, data.myRanking);
        const first = ((defaultState[0].rank - 3) > -1) ? defaultState[0].rank - 3 : 0;
        const above = data.collection.slice(first, defaultState[0].rank);
        const below = (defaultState[defaultState.length - 1].rank === data.collection.length - 1) ?
            [] :
            data.collection.slice(defaultState[defaultState.length - 1].rank + 1,
                defaultState[defaultState.length - 1].rank + 4);
        return state.merge({
            flags: state.get('flags').set('karmaRankingPending', false),
            karmaRanking: state.get('karmaRanking').merge({
                collection: data.collection,
                myRanking: data.myRanking,
                above,
                below,
                defaultState
            })
        });
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

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,

    [types.PROFILE_MANA_BURNED_SUCCESS]: (state, { data }) => {
        const comments = balanceToNumber(data.comments.manaCost);
        const entriesTotal = balanceToNumber(data.entries.manaCost);
        const votes = balanceToNumber(data.votes.manaCost);
        return state.mergeIn(['manaBurned'], { comments, entriesTotal, votes });
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
            if (!followersList.includes(follower.ethAddress)) {
                followersList = followersList.push(follower.ethAddress);
            }
        });
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
            if (!followingsList.includes(following.ethAddress)) {
                followingsList = followingsList.push(following.ethAddress);
            }
        });
        return state.merge({
            flags: state.get('flags').setIn(['fetchingMoreFollowings', request.ethAddress], false),
            followings: state.get('followings').set(request.ethAddress, followingsList),
            lastFollowing: state.get('lastFollowing').set(request.ethAddress, last),
            moreFollowings: state.get('moreFollowings').set(request.ethAddress, moreFollowings)
        });
    },

    [types.PROFILE_RESET_ESSENCE_EVENTS]: state => state.merge({
        essenceEvents: new Collection.Set([]),
        essenceIterator: new EssenceIterator()
    }),

    [types.PROFILE_RESOLVE_IPFS_HASH]: (state, { ipfsHash, columnId }) => {
        let newHashes = new Map();
        ipfsHash.forEach((hash) => { newHashes = newHashes.set(hash, true); });
        return state.mergeIn(['flags', 'resolvingIpfsHash', columnId], newHashes);
    },

    [types.PROFILE_RESOLVE_IPFS_HASH_ERROR]: (state, { error, request }) =>
        state.setIn(['flags', 'resolvingIpfsHash', request.columnId, error.ipfsHash], false),

    [types.PROFILE_RESOLVE_IPFS_HASH_SUCCESS]: (state, { data, request }) => {
        const index = request.ipfsHash.indexOf(data.ipfsHash);
        const akashaId = request.akashaIds[index];
        return state.merge({
            flags: state.get('flags').setIn(['resolvingIpfsHash', request.columnId, data.ipfsHash], false),
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
        const allFollowings = state.get('allFollowings');
        if (allFollowings.indexOf(ethAddress) > -1) {
            allFollowings.splice(allFollowings.indexOf(ethAddress), 1);
        }
        return state.merge({
            allFollowings,
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
