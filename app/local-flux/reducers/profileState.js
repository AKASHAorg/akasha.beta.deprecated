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
    nextAction: 'noAction',
    ethAddressRequested: false,
    faucetRequested: false,
    publishRequested: false,
    faucetTx: null,
    publishTx: null,
    listeningPublishTx: false,
    listeningFaucetTx: false
});

const Profile = Record({
    firstName: '',
    lastName: '',
    username: '',
    avatar: null,
    backgroundImage: [],
    about: null,
    links: [],
    profile: null,
    ethAddress: null
});

const TempProfile = Record({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    address: null,
    avatar: null,
    backgroundImage: [],
    about: null,
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
    errors: new List(),
    loginRequested: false
});

const profileState = createReducer(initialState, {
    [types.LOGIN]: state =>
        state.merge({
            loginRequested: true
        }),
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
    [types.CREATE_TEMP_PROFILE]: (state, { profileData }) => {
        return state.merge({
            tempProfile: new TempProfile({
                ...profileData,
                currentStatus: new TempProfileStatus()
            })
        });
    },
    // temp profile saved to IndexedDB successfully
    [types.CREATE_TEMP_PROFILE_SUCCESS]: (state, { profileData }) => {
        return state.mergeDeep({
            tempProfile: {
                ...profileData,
                currentStatus: state.getIn(['tempProfile', 'currentStatus']).mergeDeep({
                    nextAction: 'createEthAddress'
                })
            }
        });
    },
    // an error occured when saving temp profile to IndexedDb
    [types.CREATE_TEMP_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
    // update temp profile in IndexedDB
    [types.UPDATE_TEMP_PROFILE_SUCCESS]: (state, { tempProfile }) => {
        console.log(types.UPDATE_TEMP_PROFILE_SUCCESS, status);
        const { currentStatus, ...other } = tempProfile;
        const newState = state.merge({
            tempProfile: state.get('tempProfile').mergeDeep({
                ...other,
                currentStatus: state.getIn(['tempProfile', 'currentStatus'])
                                    .merge(new TempProfileStatus(currentStatus))
            })
        });
        console.log(newState, 'newState');
        return newState;
    },

    // error updating temp profile to IndexedDB
    [types.UPDATE_TEMP_PROFILE_ERROR]: (state, { error }) => {
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        });
    },

    // get saved temp profile from indexedDB
    [types.GET_TEMP_PROFILE_SUCCESS]: (state, { profile }) => {
        let newState = state;
        if (profile) {
            const { currentStatus, ...other } = profile;
            newState = state.merge({
                tempProfile: new TempProfile({
                    ...other,
                    currentStatus: new TempProfileStatus(currentStatus)
                })
            });
        }
        return newState;
    },

    // error getting temp profile from indexedDB
    [types.GET_TEMP_PROFILE_ERROR]: (state, { error }) => {
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        });
    },

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

    [types.CREATE_ETH_ADDRESS_SUCCESS]: (state, { data }) => {
        const newState = state.mergeIn(['tempProfile'], {
            address: data.address,
            currentStatus: state.getIn(['tempProfile', 'currentStatus']).merge({
                nextAction: 'requestFundFromFaucet'
            })
        });

        return newState;
    },

    [types.CREATE_ETH_ADDRESS_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.REQUEST_FUND_FROM_FAUCET]: (state) => {
        const newState = state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            faucetRequested: true
        });
        return newState;
    },

    [types.LISTEN_FAUCET_TX]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            listeningFaucetTx: true
        }),

    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: (state, { data }) => {
        const newState = state.mergeDeepIn(['tempProfile', 'currentStatus'],
            {
                nextAction: 'listenFaucetTx',
                faucetTx: data.tx
            }
        );
        return newState;
    },

    [types.REQUEST_FUND_FROM_FAUCET_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
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
        state.mergeIn(['tempProfile', 'currentStatus'], {
            publishTx: profileData.tx,
            nextAction: 'listenPublishTx'
        }),

    [types.PUBLISH_PROFILE_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_LOCAL_PROFILES_SUCCESS]: (state, { data }) =>
        state.merge({
            profiles: state.get('profiles').concat(data.map(prf => new Profile({
                ethAddress: prf.key,
                profile: prf.profile
            })))
        }),

    [types.GET_LOCAL_PROFILES_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_PROFILE_DATA_SUCCESS]: (state, { data }) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('profile') === data.profile
        );
        return state.mergeDeepIn(['profiles', profileIndex], data);
    },

    [types.GET_PROFILE_DATA_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),
    [types.CLEAR_PROFILE_ERRORS]: state =>
        state.merge({
            errors: new List()
        }),

});

export default profileState;
