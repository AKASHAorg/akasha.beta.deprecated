import * as types from '../constants';
import { createReducer } from './create-reducer';
import { TempProfileModel } from './models';

const initialState = new TempProfileModel();

const tempProfileState = createReducer(initialState, {
    // save a new temp profile to database
    [types.TEMP_PROFILE_CREATE]: (state, { data }) => {
        const { status, ...profile } = data;
        const newState = state.merge({
            tempProfile: TempProfileModel.createTempProfile(profile),
            status: TempProfileModel.createStatus({
                currentAction: types.TEMP_PROFILE_CREATE
            })
        });
        return newState;
    },

    [types.TEMP_PROFILE_CREATE_SUCCESS]: (state) => {
        const newState = state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_CREATE_SUCCESS
        });
        return newState;
    },

    [types.ETH_ADDRESS_CREATE]: state =>
        state.mergeIn(['status'], {
            currentAction: types.ETH_ADDRESS_CREATE
        }),

    [types.ETH_ADDRESS_CREATE_SUCCESS]: (state, { data }) => {
        const { address } = data;
        const newState = state.merge({
            tempProfile: state.get('tempProfile').setIn(['address'], address),
            status: state.get('status').setIn(['currentAction'], types.ETH_ADDRESS_CREATE_SUCCESS)
        });
        return newState;
    },

    [types.FUND_FROM_FAUCET]: state =>
        state.mergeIn(['status'], {
            faucetRequested: true,
            currentAction: types.FUND_FROM_FAUCET
        }),

    [types.FUND_FROM_FAUCET_SUCCESS]: (state, { data }) => {
        const { status } = data;
        return state.merge({
            status: state.get('status').merge({
                faucetTx: status.faucetTx,
                currentAction: types.FUND_FROM_FAUCET_SUCCESS
            })
        });
    },
    [types.TEMP_PROFILE_FAUCET_TX_MINED]: state =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_FAUCET_TX_MINED
        }),
    [types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS]: state =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS
        }),
    [types.TEMP_PROFILE_LOGIN]: state =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_LOGIN
        }),
    [types.TEMP_PROFILE_LOGIN_SUCCESS]: state =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_LOGIN_SUCCESS
        }),
    [types.TEMP_PROFILE_PUBLISH]: state =>
        state.mergeIn(['status'], {
            publishRequested: true,
            currentAction: types.TEMP_PROFILE_PUBLISH
        }),
    [types.TEMP_PROFILE_PUBLISH_SUCCESS]: (state, { data }) => {
        const { status } = data;
        return state.mergeIn(['status'], {
            publishTx: status.publishTx,
            currentAction: types.TEMP_PROFILE_PUBLISH_SUCCESS
        });
    },
    [types.TEMP_PROFILE_PUBLISH_TX_MINED]: state =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_PUBLISH_TX_MINED
        }),
    [types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS]: state =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS
        }),
    [types.TEMP_PROFILE_DELETE_SUCCESS]: state => state.clear()
});

export default tempProfileState;
