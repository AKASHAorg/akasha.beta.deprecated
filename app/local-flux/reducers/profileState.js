/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record, Map } from 'immutable';
import * as types from '../constants/ProfileConstants';
import * as entryTypes from '../constants/EntryConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: null,
    message: '',
    fatal: false
});

const Profile = Record({
    firstName: '',
    lastName: '',
    akashaId: '',
    avatar: null,
    backgroundImage: [],
    balance: 0,
    about: null,
    links: [],
    profile: null,
    ethAddress: null,
    baseUrl: '',
    followersCount: null,
    followingCount: null,
    followers: new List(),
    following: new List(),
    moreFollowers: false,
    moreFollowing: false,
    entriesCount: null,
    subscriptionsCount: null,
    entries: new List(),
    isFollower: new Map()
});

const LoggedProfile = Record({
    account: null,
    token: null,
    expiration: null,
    profile: null,
    akashaId: null
});

const Notifications = Record({
    updatingProfile: false,
    profileUpdateSuccess: false,
    following: false,
    followProfileSuccess: false,
    unfollowProfileSuccess: false
});

const initialState = fromJS({
    profiles: new List(),
    loggedProfile: new LoggedProfile(),
    errors: new List(),
    fetchingFullLoggedProfile: false,
    notifications: new Notifications(),
    flags: new Map()
});

const profileState = createReducer(initialState, {
    [types.LOGIN]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.LOGIN_SUCCESS]: (state, { profile, flags }) =>
        state.merge({
            loggedProfile: state.get('loggedProfile').merge(profile),
            flags: state.get('flags').merge(flags),
        }),

    [types.LOGIN_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags),
        }),

    [types.GET_CURRENT_PROFILE]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_CURRENT_PROFILE_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            loggedProfile: state.get('loggedProfile').merge({ profile: data.profileAddress }),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_CURRENT_PROFILE_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_LOGGED_PROFILE]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_LOGGED_PROFILE_SUCCESS]: (state, { profile, flags }) =>
        state.merge({
            loggedProfile: state.get('loggedProfile').merge(profile),
            flags: state.get('flags').merge(flags)
        }),

    [types.LOGOUT_SUCCESS]: state =>
        state.set('loggedProfile', new LoggedProfile()),

    [types.LOGOUT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_LOCAL_PROFILES]: (state, { flags }) =>
        state.merge({ flags: state.get('flags').merge(flags) }),

    [types.GET_LOCAL_PROFILES_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            profiles: new List(data.map(prf => new Profile({
                ethAddress: prf.key,
                profile: prf.profile
            }))),
            flags: state.get('flags').merge(flags)
        }),

    [types.CLEAR_LOCAL_PROFILES_SUCCESS]: state =>
        state.set('profiles', new List()),

    [types.CLEAR_OTHER_PROFILES]: state =>
        state.set('profiles', state.get('profiles').filter(profile =>
            profile.get('profile') === state.getIn(['loggedProfile', 'profile'])
        )),

    [types.GET_LOCAL_PROFILES_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PROFILE_DATA]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PROFILE_DATA_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('profile') === data.profile
        );
        // if we only fetch a single profile (loggedProfile) the state is empty
        // so this must be true
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new Profile(data)),
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], data),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.GET_PROFILE_DATA_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PROFILE_BALANCE_SUCCESS]: (state, { data }) => {
        const loggedProfileAccount = state.getIn(['loggedProfile', 'account']);
        const profileIndex = state.get('profiles').findIndex(prf => prf.ethAddress === loggedProfileAccount);
        return state.mergeIn(['profiles', profileIndex], {
            balance: data.balance
        });
    },

    [types.CLEAR_PROFILE_ERRORS]: state =>
        state.merge({
            errors: new List()
        }),

    [types.UPDATE_PROFILE_DATA]: state =>
        state.merge({
            flags: state.get('flags').merge({ updatingProfile: true })
        }),

    [types.UPDATE_PROFILE_DATA_SUCCESS]: state =>
        state.merge({
            flags: state.get('flags').merge({ updatingProfile: false }),
            notifications: state.get('notifications').merge({
                profileUpdateSuccess: true
            })
        }),

    [types.SHOW_NOTIFICATION]: (state, { notification }) => {
        if (state.getIn(['notifications', notification]) === undefined) {
            return state;
        }

        return state.merge({
            notifications: state.get('notifications').merge({
                [notification]: true
            })
        });
    },

    [types.HIDE_NOTIFICATION]: (state, { notification }) => {
        if (state.getIn(['notifications', notification]) === undefined) {
            return state;
        }

        return state.merge({
            notifications: state.get('notifications').merge({
                [notification]: false
            })
        });
    },

    [types.RESET_FLAGS]: state =>
        state.merge({
            flags: new Map()
        }),

    [types.GET_FOLLOWERS_COUNT_SUCCESS]: (state, { akashaId, count }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId
        );

        return state.mergeIn(['profiles', profileIndex], {
            followersCount: parseInt(count, 10)
        });
    },

    [types.GET_FOLLOWING_COUNT_SUCCESS]: (state, { akashaId, count }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId
        );

        return state.mergeIn(['profiles', profileIndex], {
            followingCount: parseInt(count, 10)
        });
    },

    [types.FOLLOWERS_ITERATOR]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.FOLLOWERS_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );
        let followersList = new List(data.collection.map(follower => fromJS(follower)));
        let moreFollowers = data.limit === data.collection.length;
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new Profile({
                    akashaId: data.akashaId,
                    followers: followersList,
                    moreFollowers
                })),
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: state.getIn(['profiles', profileIndex, 'followers'])
                    .concat(followersList).toSet().toList(),
                moreFollowers
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.FOLLOWERS_ITERATOR_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.FOLLOWING_ITERATOR]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.FOLLOWING_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('akashaId') === data.akashaId
        );
        let followingList = new List(data.collection.map(following => fromJS(following)));
        let moreFollowing = data.limit === data.collection.length;
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new Profile({
                    akashaId: data.akashaId,
                    following: followingList,
                    moreFollowing
                })),
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                following: state.getIn(['profiles', profileIndex, 'following'])
                    .concat(followingList).toSet().toList(),
                moreFollowing
            }),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.FOLLOWING_ITERATOR_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.FOLLOW_PROFILE]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        if (followPending === undefined) {
            return state.merge({
                flags: state.get('flags').set('followPending', new List([flags.followPending]))
            });
        }
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

    [types.FOLLOW_PROFILE_ERROR]: (state, { error, flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        if (followPending === undefined) {
            return state.merge({
                flags: state.get('flags').set('followPending', new List([flags.followPending]))
            });
        }
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending),
        });
    },

    [types.FOLLOW_PROFILE_SUCCESS]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        if (followPending === undefined) {
            return state.merge({
                flags: state.get('flags').set('followPending', new List([flags.followPending]))
            });
        }
        const index = followPending.findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === flags.followPending.akashaId);
        const loggedProfileData = state.get('profiles').find(prf =>
            prf.get('profile') === state.getIn(['loggedProfile', 'profile']));

        if (profileIndex === -1) {
            return state.merge({
                flags: state.get('flags').mergeIn(['followPending', index], flags.followPending),
                notifications: state.get('notifications').merge({
                    followProfileSuccess: true
                })
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: state.getIn(['profiles', profileIndex, 'followers'])
                    .insert(0, fromJS({ profile: loggedProfileData }))
            }),
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending),
            notifications: state.get('notifications').merge({
                followProfileSuccess: true
            })
        });
    },

    [types.UNFOLLOW_PROFILE]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        if (followPending === undefined) {
            return state.merge({
                flags: state.get('flags').set('followPending', new List([flags.followPending]))
            });
        }
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

    [types.UNFOLLOW_PROFILE_ERROR]: (state, { error, flags }) => {
        const index = state.getIn(['flags', 'followPending']).findIndex(flag =>
            flag.akashaId === flags.followPending.akashaId
        );
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.mergeIn(['flags', 'followPending', index], flags.followPending),
        });
    },

    [types.UNFOLLOW_PROFILE_SUCCESS]: (state, { flags }) => {
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
                flags: state.get('flags').mergeIn(['followPending', index], flags.followPending),
                notifications: state.get('notifications').merge({
                    unfollowProfileSuccess: true
                })
            });
        }
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: state.getIn(['profiles', profileIndex, 'followers']).filter(follower =>
                    follower.getIn(['profile', 'akashaId']) !== loggedProfileData.get('akashaId')
                )
            }),
            flags: state.get('flags').mergeIn(['followPending', index], flags.followPending),
            notifications: state.get('notifications').merge({
                unfollowProfileSuccess: true
            })
        });
    },

    [types.IS_FOLLOWER]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.IS_FOLLOWER_SUCCESS]: (state, { data, flags }) => {
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

    [types.IS_FOLLOWER_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.CLEAR_FOLLOWERS]: (state, { akashaId }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId);
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                followers: new List()
            })
        });
    },

    [types.CLEAR_FOLLOWING]: (state, { akashaId }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('akashaId') === akashaId);
        return state.merge({
            profiles: state.get('profiles').mergeIn([profileIndex], {
                following: new List()
            })
        });
    }
});

export default profileState;
