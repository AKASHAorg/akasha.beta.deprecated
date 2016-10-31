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
    username: '',
    avatar: null,
    backgroundImage: [],
    balance: 0,
    about: null,
    links: [],
    profile: null,
    ethAddress: null,
    baseUrl: ''
});

const LoggedProfile = Record({
    account: null,
    token: null,
    expiration: null,
    profile: null
});

const UpdateProfileTx = Record({
    profile: null,
    tx: null
});

const Flags = Record({
    fetchingUpdateProfileTx: false,
    deletingUpdateProfileTx: false,
    updatingProfile: false
});

const Notifications = Record({
    updatingProfile: false,
    profileUpdateSuccess: false
});

const initialState = fromJS({
    profiles: new List(),
    loggedProfile: new LoggedProfile(),
    errors: new List(),
    fetchingFullLoggedProfile: false,
    profilesFetched: false,
    updateProfileTx: new List(),
    // flags: new Flags(),
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
            loggedProfile: new LoggedProfile(profile),
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
            loggedProfile: state.get('loggedProfile').merge({ profile: data.address }),
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

    [types.GET_FULL_LOGGED_PROFILE]: state =>
        state.merge({
            fetchingFullLoggedProfile: true
        }),

    [types.LOGOUT_SUCCESS]: state =>
        state.set('loggedProfile', new LoggedProfile()),

    [types.LOGOUT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_LOCAL_PROFILES]: state =>
        state.merge({ profilesFetched: false }),

    [types.GET_LOCAL_PROFILES_SUCCESS]: (state, { data }) =>
        state.merge({
            profiles: new List(data.map(prf => new Profile({
                ethAddress: prf.key,
                profile: prf.profile
            }))),
            profilesFetched: true
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
            balance: data.value
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

    [types.ADD_UPDATE_PROFILE_TX_SUCCESS]: (state, { data }) =>
        state.merge({
            updateProfileTx: state.get('updateProfileTx').push(new UpdateProfileTx(data))
        }),

    [types.DELETE_UPDATE_PROFILE_TX]: state =>
        state.merge({
            flags: state.get('flags').merge({ deletingUpdateProfileTx: true })
        }),

    [types.DELETE_UPDATE_PROFILE_TX_SUCCESS]: (state, { tx }) =>
        state.merge({
            updateProfileTx: state.get('updateProfileTx').filter(transaction =>
                transaction.tx !== tx),
            flags: state.get('flags').merge({ deletingUpdateProfileTx: false })
        }),

    [types.DELETE_UPDATE_PROFILE_TX_ERROR]: state =>
        state.merge({
            flags: state.get('flags').merge({ deletingUpdateProfileTx: false })
        }),

    [types.GET_UPDATE_PROFILE_TXS]: state =>
        state.merge({
            flags: state.get('flags').merge({ fetchingUpdateProfileTx: true })
        }),

    [types.GET_UPDATE_PROFILE_TXS_SUCCESS]: (state, { profiles }) => {
        const updateProfileTx = profiles.find(updateTx =>
            updateTx.profile === state.getIn(['loggedProfile', 'profile'])
        );
        const newUpdateProfileTx = updateProfileTx ?
            new List([new UpdateProfileTx(updateProfileTx)]) :
            new List();
        return state.merge({
            updateProfileTx: newUpdateProfileTx,
            flags: state.get('flags').merge({ fetchingUpdateProfileTx: false })
        });
    },

    [types.GET_UPDATE_PROFILE_TXS_ERROR]: state =>
        state.merge({
            flags: state.get('flags').merge({ fetchingUpdateProfileTx: false })
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
    }
});

export default profileState;
