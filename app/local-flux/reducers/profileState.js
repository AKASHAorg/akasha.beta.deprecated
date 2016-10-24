/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record } from 'immutable';
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

const initialState = fromJS({
    profiles: new List(),
    loggedProfile: new LoggedProfile(),
    errors: new List(),
    loginRequested: false,
    profilesFetched: false
});

const profileState = createReducer(initialState, {
    [types.LOGIN]: state =>
        state.merge({
            loginRequested: true
        }),

    [types.LOGIN_SUCCESS]: (state, { profile }) =>
        state.merge({ loggedProfile: new LoggedProfile(profile) }),

    [types.GET_CURRENT_PROFILE_SUCCESS]: (state, { data }) =>
        state.merge({ loggedProfile: state.get('loggedProfile').merge({ profile: data.address }) }),

    [types.GET_CURRENT_PROFILE_ERROR]: (state, { error }) =>
        state.merge({ errors: state.get('errors').push(new ErrorRecord(error)) }),

    [types.GET_LOGGED_PROFILE_SUCCESS]: (state, { profile }) =>
        state.merge({
            loggedProfile: new LoggedProfile(profile)
        }),

    [types.LOGIN_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.LOGOUT_SUCCESS]: state =>
        state.setIn('loggedProfile', new LoggedProfile()),

    [types.LOGOUT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_LOCAL_PROFILES_SUCCESS]: (state, { data }) =>
        state.merge({
            profiles: new List(data.map(prf => new Profile({
                ethAddress: prf.key,
                profile: prf.profile
            }))),
            profilesFetched: true
        }),

    [types.GET_LOCAL_PROFILES_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PROFILE_DATA_SUCCESS]: (state, { data }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('profile') === data.profile
        );
        // if we only fetch a single profile (loggedProfile) the state is empty
        // so this must be true
        if (profileIndex === -1) {
            return state.merge({
                profiles: state.get('profiles').push(new Profile(data))
            });
        }
        return state.mergeDeepIn(['profiles', profileIndex], data);
    },

    [types.GET_PROFILE_DATA_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
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

});

export default profileState;
