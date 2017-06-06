/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Map } from 'immutable';
import * as types from '../constants';
import * as profileTypes from '../constants/ProfileConstants';
import * as appTypes from '../constants/AppConstants';
import * as tagTypes from '../constants/TagConstants';
import { createReducer } from './create-reducer';
import { ErrorRecord, LoggedProfile, ProfileRecord, ProfileState } from './records';

const initialState = new ProfileState();

const tipHandler = (state, { error, flags }) => {
    const sendingTip = state.getIn(['flags', 'sendingTip']);
    const index = sendingTip.findIndex(flag =>
        flag.akashaId === flags.sendingTip.akashaId);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                sendingTip: state.getIn(['flags', 'sendingTip'])
                    .push(flags.sendingTip)
            }),
            errors: error ?
                state.get('errors').push(new ErrorRecord(error)) :
                state.get('errors')
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['sendingTip', index], flags.sendingTip),
        errors: error ?
            state.get('errors').push(new ErrorRecord(error)) :
            state.get('errors')
    });
};

const flagHandler = (state, { flags }) =>
    state.merge({
        flags: state.get('flags').merge(flags)
    });

const errorHandler = (state, { error, flags }) =>
    state.merge({
        errors: state.get('errors').push(new ErrorRecord(error)),
        flags: state.get('flags').merge(flags)
    });

const addProfileData = (byId, profileData) => {
    if (!profileData) {
        return byId;
    }
    const { avatar, baseUrl } = profileData;
    if (avatar && baseUrl && !avatar.includes(baseUrl)) {
        profileData.avatar = `${baseUrl}/${avatar}`;
    }
    return byId.set(profileData.akashaId, new ProfileRecord(profileData));
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

const entryIteratorHandler = (state, { data }) => {
    let byId = state.get('byId');
    data.collection.forEach((entry) => {
        const publisher = entry.entryEth.publisher;
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

    [profileTypes.LOGOUT_SUCCESS]: state =>
        state.set('loggedProfile', new LoggedProfile()),

    [profileTypes.LOGOUT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [profileTypes.CLEAR_LOCAL_PROFILES_SUCCESS]: state =>
        state.set('profiles', new List()),

    [profileTypes.CLEAR_OTHER_PROFILES]: state =>
        state.set('profiles', state.get('profiles').filter(profile =>
            profile.get('profile') === state.getIn(['loggedProfile', 'profile'])
        )),

    [profileTypes.GET_PROFILE_DATA]: flagHandler,

    [profileTypes.GET_PROFILE_DATA_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('profile') === data.profile
        );
        // if we only fetch a single profile (loggedProfile) the state is empty
        // so this must be true
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new ProfileRecord(data)),
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], data),
            flags: state.get('flags').merge(flags)
        });
    },

    [profileTypes.GET_PROFILE_DATA_ERROR]: errorHandler,

    [profileTypes.GET_PROFILE_BALANCE_SUCCESS]: (state, { data }) => {
        const loggedProfileAccount = state.getIn(['loggedProfile', 'account']);
        if (loggedProfileAccount !== data.etherBase) {
            return state;
        }
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.akashaId === state.getIn(['loggedProfile', 'akashaId'])
        );
        return state.mergeIn(['profiles', profileIndex], {
            balance: data.balance
        });
    },

    [profileTypes.CLEAR_PROFILE_ERRORS]: state =>
        state.merge({
            errors: new List()
        }),

    [profileTypes.CLEAR_LOGIN_ERRORS]: state =>
        state.merge({
            errors: state.get('errors').filter(err => err.get('type') !== 'login')
        }),

    [profileTypes.UPDATE_PROFILE_DATA]: flagHandler,

    [profileTypes.UPDATE_PROFILE_DATA_ERROR]: errorHandler,

    [profileTypes.UPDATE_PROFILE_DATA_SUCCESS]: flagHandler,

    [profileTypes.RESET_FLAGS]: state =>
        state.merge({
            flags: new Map({
                followPending: new List(),
                sendingTip: new List()
            })
        }),

    [profileTypes.GET_FOLLOWERS_COUNT_SUCCESS]: (state, { akashaId, count }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId
        );

        return state.mergeIn(['profiles', profileIndex], {
            followersCount: parseInt(count, 10)
        });
    },

    [profileTypes.GET_FOLLOWING_COUNT_SUCCESS]: (state, { akashaId, count }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId
        );

        return state.mergeIn(['profiles', profileIndex], {
            followingCount: parseInt(count, 10)
        });
    },

    [profileTypes.FOLLOWERS_ITERATOR]: flagHandler,

    [profileTypes.FOLLOWERS_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );
        const moreFollowers = data.limit === data.collection.length;
        const followersList = moreFollowers ?
            fromJS(data.collection.slice(0, -1)) :
            fromJS(data.collection);
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new ProfileRecord({
                    akashaId: data.akashaId,
                    followers: followersList,
                    moreFollowers
                })),
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: followersList,
                moreFollowers
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [profileTypes.FOLLOWERS_ITERATOR_ERROR]: errorHandler,

    [profileTypes.MORE_FOLLOWERS_ITERATOR]: flagHandler,

    [profileTypes.MORE_FOLLOWERS_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );
        const moreFollowers = data.limit === data.collection.length;
        const followersList = moreFollowers ?
            fromJS(data.collection.slice(0, -1)) :
            fromJS(data.collection);

        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: state.getIn(['profiles', profileIndex, 'followers'])
                    .concat(followersList),
                moreFollowers
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [profileTypes.MORE_FOLLOWERS_ITERATOR_ERROR]: errorHandler,

    [profileTypes.FOLLOWING_ITERATOR]: flagHandler,

    [profileTypes.FOLLOWING_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );
        const moreFollowing = data.limit === data.collection.length;
        const followingList = moreFollowing ?
            fromJS(data.collection.slice(0, -1)) :
            fromJS(data.collection);
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new ProfileRecord({
                    akashaId: data.akashaId,
                    following: followingList,
                    moreFollowing
                })),
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                following: followingList,
                moreFollowing
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [profileTypes.FOLLOWING_ITERATOR_ERROR]: errorHandler,

    [profileTypes.GET_FOLLOWINGS_LIST_SUCCESS]: (state, { data }) =>
        state.setIn(['followingsList'], new List(data.collection)),

    [profileTypes.GET_FOLLOWINGS_LIST_ERROR]: errorHandler,

    [profileTypes.MORE_FOLLOWING_ITERATOR]: flagHandler,

    [profileTypes.MORE_FOLLOWING_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );
        const moreFollowing = data.limit === data.collection.length;
        const followingList = moreFollowing ?
            fromJS(data.collection.slice(0, -1)) :
            fromJS(data.collection);
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                following: state.getIn(['profiles', profileIndex, 'following'])
                    .concat(followingList),
                moreFollowing
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [profileTypes.MORE_FOLLOWING_ITERATOR_ERROR]: errorHandler,

    [profileTypes.FOLLOW_PROFILE]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        if (index === -1) {
            return state.merge({
                flags: state.get('flags').merge({
                    followPending: state.getIn(['flags', 'followPending']).push(flags.followPending)
                })
            });
        }
        return state.merge({
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
        });
    },

    [profileTypes.FOLLOW_PROFILE_ERROR]: (state, { error, flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending),
        });
    },

    [profileTypes.FOLLOW_PROFILE_SUCCESS]: (state, { profile, flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === flags.followPending.akashaId);
        const loggedProfileData = state.get('profiles').find(prf =>
            prf.get('profile') === state.getIn(['loggedProfile', 'profile']));

        if (profileIndex === -1) {
            return state.merge({
                followingsList: state.get('followingsList').push(profile),
                flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: state.getIn(['profiles', profileIndex, 'followers'])
                    .insert(0, fromJS({ profile: loggedProfileData }))
            }),
            followingsList: state.get('followingsList').push(profile),
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
        });
    },

    [profileTypes.UNFOLLOW_PROFILE]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        if (index === -1) {
            return state.merge({
                flags: state.get('flags').merge({
                    followPending: state.getIn(['flags', 'followPending']).push(flags.followPending)
                })
            });
        }
        return state.merge({
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
        });
    },

    [profileTypes.UNFOLLOW_PROFILE_ERROR]: (state, { error, flags }) => {
        const index = state.getIn(['flags', 'followPending']).findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.mergeIn(['flags', 'followPending', index], flags.followPending),
        });
    },

    [profileTypes.UNFOLLOW_PROFILE_SUCCESS]: (state, { profile, flags }) => {
        const { akashaId } = flags.followPending;
        const index = state.getIn(['flags', 'followPending']).findIndex(flag =>
            flag.akashaId === akashaId
        );
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId);
        const loggedProfileIndex = state.get('profiles').findIndex(prf =>
            prf.get('profile') === state.getIn(['loggedProfile', 'profile']));
        const loggedProfileData = state.getIn(['profiles', loggedProfileIndex]);
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').mergeIn([loggedProfileIndex], {
                    following: state.getIn(['profiles', loggedProfileIndex, 'following'])
                        .filter(following => following.getIn(['profile', 'akashaId']) !== akashaId)
                }),
                followingsList: state.get('followingsList').delete(state.get('followingsList').findIndex(pro => pro === profile)),
                flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: state.getIn(['profiles', profileIndex, 'followers']).filter(follower =>
                    follower.getIn(['profile', 'akashaId']) !== loggedProfileData.get('akashaId')
                )
            }),
            followingsList: state.get('followingsList').delete(state.get('followingsList').findIndex(pro => pro === profile)),
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending)
        });
    },

    [profileTypes.IS_FOLLOWER]: flagHandler,

    [profileTypes.IS_FOLLOWER_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );

        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex, 'isFollower'], {
                [data.following]: data.count
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [profileTypes.IS_FOLLOWER_ERROR]: errorHandler,

    [profileTypes.SEND_TIP]: tipHandler,

    [profileTypes.SEND_TIP_SUCCESS]: tipHandler,

    [profileTypes.SEND_TIP_ERROR]: tipHandler,

    [profileTypes.CLEAR_FOLLOWERS]: (state, { akashaId }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId);
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: new List()
            })
        });
    },

    [profileTypes.CLEAR_FOLLOWING]: (state, { akashaId }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId);
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                following: new List()
            })
        });
    },

    [tagTypes.SUBSCRIBE_TAG_SUCCESS]: (state) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('profile') === state.getIn(['loggedProfile', 'profile']));
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                subscriptionsCount:
                    parseInt(state.getIn(['profiles', profileIndex, 'subscriptionsCount']), 10) + 1
            })
        });
    },
    [tagTypes.UNSUBSCRIBE_TAG_SUCCESS]: (state) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('profile') === state.getIn(['loggedProfile', 'profile']));
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                subscriptionsCount:
                    parseInt(state.getIn(['profiles', profileIndex, 'subscriptionsCount']), 10) - 1
            })
        });
    },
    [appTypes.CLEAN_STORE]: () => initialState,

// ***************************** NEW REDUCERS **************************************

    [types.COMMENTS_ITERATOR_SUCCESS]: commentsIteratorHandler,

    [types.COMMENTS_MORE_ITERATOR_SUCCESS]: commentsIteratorHandler,

    [types.ENTRY_GET_FULL_SUCCESS]: (state, { data }) => {
        const { publisher } = data.entryEth;
        if (!publisher) {
            return state;
        }
        return state.set('byId', addProfileData(state.get('byId'), publisher));
    },

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.PROFILE_CLEAR_LOCAL]: state =>
        state.merge({
            ethAddresses: new Map(),
            localProfiles: new List()
        }),

    [types.PROFILE_CLEAR_LOGIN_ERRORS]: state =>
        state.set('loginErrors', new List()),

    [types.PROFILE_DELETE_LOGGED_SUCCESS]: state =>
        state.set('loggedProfile', new LoggedProfile()),

    [types.PROFILE_FOLLOW]: (state, { akashaId }) =>
        state.setIn(['flags', 'followPending', akashaId], true),

    [types.PROFILE_FOLLOW_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'followPending', request.akashaId], false),

    [types.PROFILE_FOLLOW_SUCCESS]: (state, { data }) => {
        const loggedAkashaId = state.getIn(['loggedProfile', 'akashaId']);
        const loggedProfile = state.getIn(['byId', loggedAkashaId]);
        const followingsCount = loggedProfile.get('followingsCount');
        const profile = state.getIn(['byId', data]);
        const oldFollowers = state.getIn(['followers', data]);
        const oldFollowings = state.getIn(['followings', loggedAkashaId]);
        const followers = oldFollowers ?
            state.get('followers').set(data, oldFollowers.unshift(loggedAkashaId)) :
            oldFollowers;
        return state.merge({
            byId: state.get('byId').merge({
                [data]: profile ?
                    profile.set('followersCount', profile.get('followersCount') + 1) :
                    undefined,
                [loggedAkashaId]: loggedProfile.set('followingsCount', followingsCount + 1)
            }),
            flags: state.get('flags').setIn(['followPending', data], false),
            followers,
            followings: state.get('followings').set(loggedAkashaId, oldFollowings.unshift(data)),
        });
    },

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
            lastFollower: state.get('lastFollowing').set(data.akashaId, lastIndex),
            moreFollowers: state.get('moreFollowers').set(data.akashaId, moreFollowers)
        });
    },

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
        if (state.getIn(['loggedProfile', 'account']) !== data.etherBase) {
            return state;
        }
        return state.set('balance', data.balance);
    },

    [types.PROFILE_GET_CURRENT]: state =>
        state.setIn(['flags', 'currentProfilePending'], true),

    [types.PROFILE_GET_CURRENT_ERROR]: state =>
        state.setIn(['flags', 'currentProfilePending'], false),

    [types.PROFILE_GET_CURRENT_SUCCESS]: (state, { data }) => {
        const loggedProfile = state.getIn(['loggedProfile', 'account']) ?
            state.get('loggedProfile').merge({
                akashaId: data.akashaId,
                profile: data.profileAddress
            }) :
            state.get('loggedProfile');
        return state.merge({
            loggedProfile,
            flags: state.get('flags').set('currentProfilePending', false)
        });
    },

    [types.PROFILE_GET_DATA]: state =>
        state.setIn(['flags', 'fetchingProfileData'], true),

    [types.PROFILE_GET_DATA_ERROR]: state =>
        state.setIn(['flags', 'fetchingProfileData'], false),

    [types.PROFILE_GET_DATA_SUCCESS]: (state, { data }) =>
        state.merge({
            byId: addProfileData(state.get('byId'), data),
            flags: state.get('flags').set('fetchingProfileData', false)
        }),

    [types.PROFILE_GET_LIST]: state =>
        state.setIn(['flags', 'fetchingProfileList'], true),

    [types.PROFILE_GET_LIST_ERROR]: state =>
        state.setIn(['flags', 'fetchingProfileList'], false),

    [types.PROFILE_GET_LIST_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        data.collection.forEach((profileData) => {
            byId = addProfileData(byId, profileData);
        });
        return state.merge({
            byId,
            flags: state.get('flags').set('fetchingProfileList', false)
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
        let ethAddresses = state.get('ethAddresses');
        let localProfiles = state.get('localProfiles');
        data.forEach((prf) => {
            ethAddresses = ethAddresses.set(prf.akashaId, prf.key);
            localProfiles = localProfiles.push(prf.akashaId);
        });
        return state.merge({
            ethAddresses,
            flags: state.get('flags').merge({
                fetchingLocalProfiles: false,
                localProfilesFetched: true
            }),
            localProfiles
        });
    },

    [types.PROFILE_GET_LOGGED_SUCCESS]: (state, { data }) =>
        state.set('loggedProfile', new LoggedProfile(data)),

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

    [types.PROFILE_UNFOLLOW]: (state, { akashaId }) =>
        state.setIn(['flags', 'followPending', akashaId], true),

    [types.PROFILE_UNFOLLOW_ERROR]: (state, { request }) =>
        state.setIn(['flags', 'followPending', request.akashaId], false),

    [types.PROFILE_UNFOLLOW_SUCCESS]: (state, { data }) => {
        const loggedAkashaId = state.getIn(['loggedProfile', 'akashaId']);
        const loggedProfile = state.getIn(['byId', loggedAkashaId]);
        const followingsCount = loggedProfile.get('followingsCount');
        const profile = state.getIn(['byId', data]);
        const oldFollowers = state.get('followers');
        const oldFollowings = state.get('followings');
        const followersList = oldFollowers.get(data);
        const followingsList = oldFollowings.get(loggedAkashaId);
        const followers = followersList ?
            oldFollowers.set(data, followersList.filter(id => id !== loggedAkashaId)) :
            oldFollowers;
        return state.merge({
            byId: state.get('byId').merge({
                [data]: profile ?
                    profile.set('followersCount', profile.get('followersCount') - 1) :
                    undefined,
                [loggedAkashaId]: loggedProfile.set('followingsCount', followingsCount - 1)
            }),
            flags: state.get('flags').setIn(['followPending', data], false),
            followers,
            followings: oldFollowings
                .set(loggedAkashaId, followingsList.filter(id => id !== data)),
        });
    },
});

export default profileState;
