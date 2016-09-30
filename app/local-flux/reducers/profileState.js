import { fromJS, List, Record, Map } from 'immutable';
import * as types from '../constants/ProfileConstants';
import * as transactionTypes from '../constants/TransactionConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record ({
    code: null,
    message: '',
    fatal: false
});

const Profile = Record({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    address: null,
    avatar: {},
    backgroundImage: [],
    about: '',
    links: []
});

const TempProfile = Record({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    address: null,
    avatar: {},
    backgroundImage: [],
    about: '',
    links: [],
    currentStatus: {
        currentStep: 0,
        success: false,
        error: new ErrorRecord(),
        faucetRequested: false,
        faucetTx: null,
        publishTx: null
    }
});

const LoggedProfile = Record({
    account: null,
    token: null,
    expiration: null
});

const initialState = fromJS({
    profiles: new List(),
    loggedProfile: new LoggedProfile(),
    tempProfile: new TempProfile(),
    errors: new List()
});

const profileState = createReducer(initialState, {
    [types.LOGIN_SUCCESS]: (state, action) =>
        state.merge({ loggedProfile: new LoggedProfile(action.profile) }),

    [types.LOGIN_ERROR]: (state, action) =>
        console.log(action.error, 'error'),

    [types.GET_PROFILES_LIST_SUCCESS]: (state, action) =>
        state.merge({ profiles: state.get('profiles').concat(action.profiles.map(prof => new Profile(prof))) }),

    [types.GET_PROFILES_LIST_ERROR]: (state, action) =>
        state.merge({ profiles: [], messages: action.message }),

    [types.CREATE_TEMP_PROFILE_SUCCESS]: (state, action) =>
        state.merge({
            tempProfile: new TempProfile(action.profileData)
        }),

    [types.UPDATE_TEMP_PROFILE_SUCCESS]: (state, action) =>
        state.merge({
            tempProfile: state.get('tempProfile').merge(fromJS(action.profileData))
        }),

    [types.GET_TEMP_PROFILE_SUCCESS]: (state, action) =>
        state.set('tempProfile', new TempProfile(fromJS(action.profile))),

    [types.GET_TEMP_PROFILE_ERROR]: (state, action) => {
        console.log(action.error, 'GET_TEMP_PROFILE_ERROR');
        return state;
    },
    [types.CREATE_ETH_ADDRESS]: state =>
        state.merge({
            console.error('rewrite this');
        }),

    [types.CREATE_ETH_ADDRESS_SUCCESS]: (state, action) =>
        state.merge({
            console.error('rewrite this');
        }),

    [types.CREATE_ETH_ADDRESS_ERROR]: state =>
        state.merge({
            console.error('rewrite this');
        }),

    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: state =>
        state.merge({
            console.error('rewrite this');
        }),

    [types.REQUEST_FUND_FROM_FAUCET_ERROR]: (state, action) =>
        state.merge({
            tempProfile: state.get('tempProfile').merge({
                currentStatus: state.getIn(['tempProfile', 'currentStatus']).merge({
                    success: false,
                    error: action.error
                })
            })
        }),

    [types.GET_PROFILE_DATA_SUCCESS]: (state, action) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('ipfsHash') === action.profile.ipfsHash
        );
        return state.mergeIn(['profiles', profileIndex], action.profile);
    }

});

export default profileState;
