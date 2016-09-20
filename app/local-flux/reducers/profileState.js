import { fromJS, List, Record } from 'immutable';
import * as types from '../constants/ProfileConstants';
import { createReducer } from './create-reducer';

const TempProfile = Record({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    password2: '',
    address: '',
    optionalData: {
        avatar: {},
        backgroundImage: [],
        about: '',
        links: []
    },
    currentStatus: {
        currentStep: '',
        status: '',
        message: '',
        faucetRequested: false
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
    afterAuthAction: ''
});

const profileState = createReducer(initialState, {
    [types.LOGIN_SUCCESS]: (state, action) =>
        state.merge({ loggedProfile: new LoggedProfile(action.profile) }),

    [types.GET_PROFILES_LIST_SUCCESS]: (state, action) =>
        state.merge({ profiles: fromJS(action.profiles) }),

    [types.GET_PROFILES_LIST_ERROR]: (state, action) =>
        state.merge({ profiles: [], messages: action.message }),

    [types.GET_TEMP_PROFILE_SUCCESS]: (state, action) =>
        state.update('tempProfile', () => new TempProfile(action.profile)),

    [types.CREATE_ETH_ADDRESS]: state =>
        state.updateIn(['tempProfile', 'currentStatus'],
            cStatus => Object.assign(cStatus, { status: 'pending' })
        ),

    [types.CREATE_ETH_ADDRESS_SUCCESS]: (state, action) =>
        state.mergeDeep(fromJS({
            tempProfile: {
                address: action.data.coinbase,
                currentStatus: {
                    status: 'finished'
                }
            }
        })),

    [types.CREATE_ETH_ADDRESS_ERROR]: state =>
        state.updateIn(['tempProfile', 'currentStatus'],
            cStatus => Object.assign(cStatus, { status: 'failed' })
        ),

    [types.FUND_FROM_FAUCET]: state =>
        state.updateIn(['tempProfile', 'currentStatus'],
            cStatus => Object.assign(cStatus, { status: 'pending' })
        ),

    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: state =>
        state.updateIn(['tempProfile', 'currentStatus'],
            cStatus => Object.assign(cStatus, { faucetRequested: true })
        ),

    [types.FUND_FROM_FAUCET_SUCCESS]: state =>
        state.updateIn(['tempProfile', 'currentStatus'],
            cStatus => Object.assign(cStatus, { status: 'finished' })
        ),

    [types.FUND_FROM_FAUCET_ERROR]: state =>
        state.updateIn(['tempProfile', 'currentStatus'],
            cStatus => Object.assign(cStatus, { status: 'failed' })
        ),

    [types.GET_PROFILE_DATA_SUCCESS]: (state, action) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('ipfsHash') === action.profile.ipfsHash
        );
        return state.mergeIn(['profiles', profileIndex], action.profile);
    },
    [types.SET_AFTER_AUTH_ACTION]: (state, action) =>
        state.merge({
            afterAuthAction: action.nextAction,
            afterAuthActionPayload: action.payload
        }),

});

export default profileState;
