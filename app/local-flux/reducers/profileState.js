/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record, Map } from 'immutable';
import * as types from '../constants/ProfileConstants';
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
    followers: [],
    following: [],
    entriesCount: 0,
    subscriptionsCount: 0
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
    followProfileSuccess: false
});

const initialState = fromJS({
    profiles: new List(),
    loggedProfile: new LoggedProfile(),
    errors: new List(),
    fetchingFullLoggedProfile: false,
    profilesFetched: false,
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

    [types.GET_LOCAL_PROFILES_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PROFILE_DATA]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PROFILE_DATA_FULL]: state =>
        state.merge({
            fetchingFullProfileData: true
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

    [types.GET_FOLLOWERS_COUNT_SUCCESS]: (state, { profileAddress, count }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('profile') === profileAddress
        );

        return state.mergeIn(['profiles', profileIndex], {
            followersCount: count
        });
    },

    [types.GET_FOLLOWING_COUNT_SUCCESS]: (state, { profileAddress, count }) => {
        const profileIndex = state.get('profiles').findIndex(prf =>
            prf.get('profile') === profileAddress
        );

        return state.mergeIn(['profiles', profileIndex], {
            followingCount: count
        });
    },

    [types.FOLLOW_PROFILE]: (state, { flags }) => {
        const followPending = state.getIn(['flags', 'followPending']);
        if (followPending === undefined) {
            return state.merge({
                flags: state.get('flags').set('followPending', new List([flags.followPending]))
            });
        }
        const index = followPending.findIndex(flag =>
            flag.profileAddress === flags.followPending.profileAddress
        );
        if (index === -1) {
            return state.merge({
                flags: followPending.push(flags.followPending)
            });
        }
        return state.merge({
            flags: state.mergeIn(['flags', 'followPending', index], flags.followPending)
        });
    },

    [types.FOLLOW_PROFILE_ERROR]: (state, { error, flags }) => {
        const index = state.getIn(['flags', 'followPending']).findIndex(flag =>
            flag.profileAddress === flags.followPending.profileAddress
        );
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.mergeIn(['flags', 'followPending', index], flags.followPending),
        });
    },

    [types.FOLLOW_PROFILE_SUCCESS]: (state, { flags }) => {
        const index = state.getIn(['flags', 'followPending']).findIndex(flag =>
            flag.profileAddress === flags.followPending.profileAddress
        );
        return state.merge({
            flags: state.mergeIn(['flags', 'followPending', index], flags.followPending),
            notifications: state.get('notifications').merge({
                followProfileSuccess: true
            })
        });
    }
});

export default profileState;
