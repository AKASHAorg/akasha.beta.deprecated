import { fromJS, List, Record, Map } from 'immutable';
import * as types from '../constants/ProfileConstants';
import * as transactionTypes from '../constants/TransactionConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record ({
    code: null,
    message: '',
    fatal: false
});
const TempProfileStatus = Record({
    currentStep: 0,
    success: false,
    faucetRequested: false,
    publishRequested: false,
    faucetTx: null,
    publishTx: null
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
    currentStatus: new TempProfileStatus()
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
    [types.LOGIN_SUCCESS]: (state, { profile }) =>
        state.merge({ loggedProfile: new LoggedProfile(profile) }),

    [types.LOGIN_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.LOGOUT_SUCCESS]: (state, { data }) =>
        state.setIn('loggedProfile', new LoggedProfile()),

    [types.LOGOUT_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
    // start saving a new temp profile to database
    [types.CREATE_TEMP_PROFILE]: (state, { profileData }) =>
        state.merge({
            tempProfile: new TempProfile({
                ...profileData,
                currentStatus: new TempProfileStatus({
                    currentStep: 0,
                    success: false
                })
            })
        }),
    // temp profile saved to IndexedDB successfully
    [types.CREATE_TEMP_PROFILE_SUCCESS]: (state, { profileData }) =>
        state.mergeDeep({
            tempProfile: {
                ...profileData,
                currentStatus: state.mergeIn(['tempProfile', 'currentStatus'], {
                    currentStep: 0,
                    success: true
                })
            }
        }),
    // an error occured when saving temp profile to IndexedDb
    [types.CREATE_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            tempProfile: state.get('tempProfile').mergeIn(['currentStatus'], {
                currentStep: 0,
                success: false
            })
        }),
    // update temp profile in IndexedDB
    [types.UPDATE_TEMP_PROFILE_SUCCESS]: (state, { profileData }) =>
        state.mergeDeep({
            tempProfile: {
                ...profileData,
                currentStatus: state.mergeIn(['tempProfile', 'currentStatus'], {
                    success: true
                })
            }
        }),
    // error updating temp profile to IndexedDB
    [types.UPDATE_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            tempProfile: state.get('tempProfile').mergeIn(['currentStatus'], {
                success: false
            })
        }),
    // get saved temp profile from indexedDB
    [types.GET_TEMP_PROFILE_SUCCESS]: (state, { profile }) =>
        state.set('tempProfile', new TempProfile(profile)),
    // error getting temp profile from indexedDB
    [types.GET_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('tempProfile').push(new ErrorRecord(error))
        }),
    // delete temp profile from indexedDB. Usually after profile was successfully published
    [types.DELETE_TEMP_PROFILE_SUCCESS]: state =>
        state.set('tempProfile', new TempProfile()),
    // error deleting temp profile from indexedDB.
    [types.DELETE_TEMP_PROFILE_ERROR]: (state, { error }) =>
    state.merge({
        errors: state.get('errors').push(new ErrorRecord(error))
    }),

    [types.CREATE_ETH_ADDRESS]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            currentStep: 1,
            success: false
        }),

    [types.CREATE_ETH_ADDRESS_SUCCESS]: (state, { data }) =>
        state.mergeDeepIn(['tempProfile'], {
            address: data
        }),

    [types.CREATE_ETH_ADDRESS_ERROR]: (state, { error }) =>
        state.merge({
            tempProfile: state.get('tempProfile').mergeIn(['currentStatus'], {
                success: false
            }),
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.REQUEST_FUND_FROM_FAUCET]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            currentStep: 2,
            success: false,
            faucetRequested: true
        }),

    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: (state, { data }) =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'],
            {
                faucetTx: data
            }
        ),

    [types.REQUEST_FUND_FROM_FAUCET_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            tempProfile: state.get('tempProfile').mergeIn(['currentStatus'], {
                success: false
            })
        }),
    [types.COMPLETE_PROFILE_CREATION]: (state) =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            currentStep: 3,
            publishRequested: true
        }),
    [types.COMPLETE_PROFILE_CREATION_SUCCESS]: (state, { profileData }) =>
        console.log(profileData, 'complete profile creation reducer'),

    [types.COMPLETE_PROFILE_CREATION_ERROR]: (state, { error }) =>
        console.log(error, 'complete profile creation error reducer'),

    [types.GET_LOCAL_PROFILES_SUCCESS]: (state, { data }) =>
        state.merge({
            profiles: state.get('profiles').concat(data.map(profile => new Profile(profile)))
        }),

    [types.GET_LOCAL_PROFILES_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PROFILE_DATA_SUCCESS]: (state, { data }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('ipfsHash') === data.ipfsHash
        );
        return state.mergeIn(['profiles', profileIndex], data);
    },

    [types.GET_PROFILE_DATA_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

});

export default profileState;
