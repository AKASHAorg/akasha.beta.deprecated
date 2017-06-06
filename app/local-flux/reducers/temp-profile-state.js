import * as types from '../constants';
import { createReducer } from './create-reducer';
import { TempProfileModel } from './models';

const initialState = new TempProfileModel();

const tempProfileState = createReducer(initialState, {
    [types.TEMP_PROFILE_GET_SUCCESS]: (state, { data }) => {
        const { status, ...tempProfile } = data;
        return state.merge({
            tempProfile: state.get('tempProfile').merge(TempProfileModel.createTempProfile(tempProfile)),
            status: state.get('status').merge(status)
        });
    },
    // save a new temp profile to database
    [types.TEMP_PROFILE_CREATE]: state =>
        state.merge({
            status: TempProfileModel.createStatus({
                currentAction: types.TEMP_PROFILE_CREATE
            })
        }),
    // create a new temp profile for updates
    [types.SET_TEMP_PROFILE]: (state, { data }) =>
        state.merge({
            tempProfile: TempProfileModel.profileToTempProfile(data),
            status: TempProfileModel.createStatus({
                currentAction: types.UPDATE_TEMP_PROFILE
            })
        }),

    [types.TEMP_PROFILE_UPDATE]: (state, { data }) =>
        state.mergeIn(['tempProfile'], data),

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
        const { response } = data;
        return state.merge({
            status: state.get('status').merge({
                faucetTx: response.data.tx,
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
    [types.TEMP_PROFILE_LOGIN_SUCCESS]: (state, action) =>
        state.mergeIn(['status'], {
            currentAction: types.TEMP_PROFILE_LOGIN_SUCCESS,
            token: action.data.response.data.token
        }),
    [types.TEMP_PROFILE_PUBLISH]: state =>
        state.mergeIn(['status'], {
            publishRequested: true,
            currentAction: types.TEMP_PROFILE_PUBLISH
        }),
    [types.TEMP_PROFILE_PUBLISH_SUCCESS]: (state, { data }) => {
        const { response } = data;
        return state.mergeIn(['status'], {
            publishTx: response.data.tx,
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
    [types.TEMP_PROFILE_DELETE_SUCCESS]: state => state.clear(),
    [types.TEMP_PROFILE_STATUS_RESET]: state => state.setIn(['status'], state.get('status').clear())
});

export default tempProfileState;
