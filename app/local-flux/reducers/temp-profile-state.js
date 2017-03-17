/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record } from 'immutable';
import * as types from '../constants/temp-profile-constants';
import { createReducer } from './create-reducer';
import { TempProfileModel } from './models';

const initialState = new TempProfileModel();

const tempProfileState = createReducer(initialState, {
    // start saving a new temp profile to database
    [types.TEMP_PROFILE_CREATE]: (state, { profileData }) =>
        state.setIn(['tempProfile'], state.get('tempProfile').castToRecord(profileData)),
    // temp profile saved to IndexedDB successfully
    [types.TEMP_PROFILE_CREATE_SUCCESS]: (state, { profileData }) =>
        state,
    // update temp profile in IndexedDB
    [types.TEMP_PROFILE_UPDATE_SUCCESS]: (state, { tempProfile }) => {
        const { currentStatus, ...other } = tempProfile;
        return state.merge({
            tempProfile: state.get('tempProfile').mergeDeep({
                ...other,
                currentStatus: state.getIn(['tempProfile', 'currentStatus'])
                                    .merge(new TempProfileStatus(currentStatus))
            })
        });
    },
    // get saved temp profile from indexedDB
    [types.TEMP_PROFILE_GET_SUCCESS]: (state, { profile }) => {
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
    // delete temp profile from indexedDB. Usually after profile was successfully published
    [types.TEMP_PROFILE_DELETE_SUCCESS]: state =>
        state.set('tempProfile', new TempProfile()),

    [types.ETH_ADDRESS_CREATE]: state =>
        state,

    [types.ETH_ADDRESS_CREATE_SUCCESS]: (state, { data }) =>
        state,

    [types.FUND_FROM_FAUCET]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            faucetRequested: true
        }),

    [types.LISTEN_FAUCET_TX]: state =>
        state.mergeDeepIn(['tempProfile', 'currentStatus'], {
            listeningFaucetTx: true
        }),

    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: (state, { data }) =>
        state,
    [types.LISTEN_PUBLISH_TX]: state =>
        state,

    [types.PUBLISH_PROFILE]: state =>
        state.mergeIn(['tempProfile', 'currentStatus'], {
            publishRequested: true
        }),

    [types.PUBLISH_PROFILE_SUCCESS]: (state, { profileData }) =>
        state,
});

export default tempProfileState;
