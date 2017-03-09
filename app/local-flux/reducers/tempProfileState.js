/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record } from 'immutable';
import * as types from '../constants/temp-profile-constants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: null,
    message: '',
    fatal: false
});

const TempProfileStatus = Record({
    nextAction: 'noAction',
    ethAddressRequested: false,
    faucetRequested: false,
    publishRequested: false,
    faucetTx: null,
    publishTx: null,
    listeningPublishTx: false,
    listeningFaucetTx: false
});

const TempProfile = Record({
    firstName: '',
    lastName: '',
    akashaId: '',
    password: '',
    address: null,
    avatar: null,
    backgroundImage: [],
    about: null,
    links: [],
    currentStatus: new TempProfileStatus()
});

const initialState = fromJS({
    tempProfile: new TempProfile(),
    errors: new List(),
    loginRequested: false,
});

const tempProfileState = createReducer(initialState, {
    // start saving a new temp profile to database
    [types.CREATE_TEMP_PROFILE]: (state, { profileData }) =>
        state.merge({
            tempProfile: new TempProfile({
                ...profileData,
                currentStatus: new TempProfileStatus()
            })
        }),
    // temp profile saved to IndexedDB successfully
    [types.CREATE_TEMP_PROFILE_SUCCESS]: (state, { profileData, nextAction }) =>
        state.mergeDeep({
            tempProfile: {
                ...profileData,
                currentStatus: state.getIn(['tempProfile', 'currentStatus']).mergeDeep({
                    nextAction
                })
            }
        }),
    // an error occured when saving temp profile to IndexedDb
    [types.CREATE_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
    // update temp profile in IndexedDB
    [types.UPDATE_TEMP_PROFILE_SUCCESS]: (state, { tempProfile }) => {
        const { currentStatus, ...other } = tempProfile;
        return state.merge({
            tempProfile: state.get('tempProfile').mergeDeep({
                ...other,
                currentStatus: state.getIn(['tempProfile', 'currentStatus'])
                                    .merge(new TempProfileStatus(currentStatus))
            })
        });
    },

    // error updating temp profile to IndexedDB
    [types.UPDATE_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    // get saved temp profile from indexedDB
    [types.GET_TEMP_PROFILE_SUCCESS]: (state, { profile }) => {
        if (profile) {
            const { currentStatus, ...other } = profile;
            return state.merge({
                tempProfile: new TempProfile({
                    ...other,
                    currentStatus: new TempProfileStatus(currentStatus)
                })
            });
        }
        return state;
    },

    // error getting temp profile from indexedDB
    [types.GET_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
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
            ethAddressRequested: true
        }),

    [types.CREATE_ETH_ADDRESS_SUCCESS]: (state, { data }) =>
        state.mergeIn(['tempProfile'], {
            address: data.address,
            currentStatus: state.getIn(['tempProfile', 'currentStatus']).merge({
                nextAction: 'requestFundFromFaucet'
            })
        }),

    [types.CREATE_ETH_ADDRESS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.REQUEST_FUND_FROM_FAUCET]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            faucetRequested: true
        }),

    [types.LISTEN_FAUCET_TX]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            listeningFaucetTx: true
        }),

    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: (state, { data }) =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'],
            {
                nextAction: 'listenFaucetTx',
                faucetTx: data.tx
            }
        ),

    [types.REQUEST_FUND_FROM_FAUCET_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            tempProfile: state.get('tempProfile').setIn(['currentStatus', 'faucetRequested'], false)
        }),

    [types.LISTEN_PUBLISH_TX]: state =>
        state.mergeIn(['tempProfile', 'currentStatus'], {
            listeningPublishTx: true
        }),

    [types.PUBLISH_PROFILE]: state =>
        state.mergeIn(['tempProfile', 'currentStatus'], {
            publishRequested: true
        }),

    [types.PUBLISH_PROFILE_SUCCESS]: (state, { profileData }) =>
        state.merge({
            tempProfile: state.get('tempProfile').merge({
                currentStatus: state.getIn(['tempProfile', 'currentStatus']).merge({
                    publishTx: profileData.tx,
                    nextAction: 'listenPublishTx'
                })
            }),
            loginRequested: false
        }),

    [types.PUBLISH_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
    [types.TEMP_LOGIN]: state =>
        state.set('loginRequested', true),

    [types.CLEAR_TEMP_PROFILE_ERRORS]: state =>
        state.merge({
            errors: new List()
        })

});

export default tempProfileState;
