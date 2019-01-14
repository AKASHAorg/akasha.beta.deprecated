import { Map } from 'immutable';
import { createReducer } from './utils';
import ErrorStateModel from './state-models/error-state-model';
import * as types from '../constants';

const initialState = new ErrorStateModel();

const errorState = createReducer(initialState, {
    [types.BACKUP_KEYS_ERROR]: (state) => state.addNewError(state),
    // [types.COMMENTS_DOWNVOTE_ERROR]: (state) => state.addNewError(state),
    // [types.COMMENTS_PUBLISH_ERROR]: (state) => state.addNewError(state),
    // [types.COMMENTS_UPVOTE_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_ADD_COLUMN_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_ADD_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_DELETE_COLUMN_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_GET_ACTIVE_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_GET_ALL_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_SET_ACTIVE_ERROR]: (state) => state.addNewError(state),
    [types.DASHBOARD_UPDATE_COLUMN_ERROR]: (state) => state.addNewError(state),
    [types.DRAFT_CREATE_ERROR]: (state) => state.addNewError(state),
    [types.DRAFT_UPDATE_ERROR]: (state) => state.addNewError(state),
    [types.ENTRIES_GET_AS_DRAFTS_ERROR]: (state) => state.addNewError(state),
    [types.DRAFT_PUBLISH_ERROR]: (state) => state.addNewError(state),
    [types.DRAFT_PUBLISH_UPDATE_ERROR]: (state) => state.addNewError(state),
    // [types.ENTRY_CLAIM_ERROR]: (state) => state.addNewError(state),
    // [types.ENTRY_CLAIM_VOTE_ERROR]: (state) => state.addNewError(state),
    // [types.ENTRY_DOWNVOTE_ERROR]: (state) => state.addNewError(state),
    // [types.ENTRY_GET_FULL_ERROR]: (state) => state.addNewError(state),
    // [types.ENTRY_UPVOTE_ERROR]: (state) => state.addNewError(state),
    [types.ERROR_DELETE_FATAL]: (state, { id }) => {
        const index = state.get('fatalErrors').findIndex(err => err.id === id);
        return state.merge({
            fatalErrors: state.get('fatalErrors').delete(index)
        });
    },
    [types.ERROR_DELETE_NON_FATAL]: (state, { id }) => {
        const index = state.get('nonFatalErrors').findIndex(err => err === id);
        return state.merge({
            nonFatalErrors: state.get('nonFatalErrors').delete(index)
        });
    },
    [types.ERROR_DISPLAY]: (state, { err }) =>
        state.merge({
            nonFatalErrors: state.get('nonFatalErrors').push(err.id)
        }),
    [types.SHOW_REPORT_MODAL]: (state, { data }) =>
        state.merge({
            reportError: new Map(data.error)
        }),
    [types.HIDE_REPORT_MODAL]: state =>
        state.merge({
            reportError: new Map()
        }),
    // [types.ETH_ADDRESS_CREATE_ERROR]: (state) => state.addNewError(state),
    // [types.FUND_FROM_FAUCET_ERROR]: (state) => state.addNewError(state),
    [types.GENERAL_SETTINGS_ERROR]: (state) => state.addNewError(state),
    [types.GENERAL_SETTINGS_SAVE_ERROR]: (state) => state.addNewError(state),
    // [types.GETH_GET_OPTIONS_ERROR]: (state) => state.addNewError(state),
    // [types.GETH_GET_STATUS_ERROR]: (state) => state.addNewError(state),
    [types.GETH_SAVE_SETTINGS_ERROR]: (state) => state.addNewError(state),
    [types.GETH_SETTINGS_ERROR]: (state) => state.addNewError(state),
    // [types.GETH_START_ERROR]: (state) => state.addNewError(state),
    // [types.GETH_STOP_ERROR]: (state) => state.addNewError(state),
    // [types.IPFS_GET_CONFIG_ERROR]: (state) => state.addNewError(state),
    // [types.IPFS_GET_PORTS_ERROR]: (state) => state.addNewError(state),
    // [types.IPFS_GET_STATUS_ERROR]: (state) => state.addNewError(state),
    [types.IPFS_SAVE_SETTINGS_ERROR]: (state) => state.addNewError(state),
    // [types.IPFS_SET_PORTS_ERROR]: (state) => state.addNewError(state),
    [types.IPFS_SETTINGS_ERROR]: (state) => state.addNewError(state),
    // [types.IPFS_START_ERROR]: (state) => state.addNewError(state),
    // [types.IPFS_STOP_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_BOND_AETH_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_CYCLE_AETH_ERROR]: (state) => state.addNewError(state),
    [types.PROFILE_FAUCET_ERROR]: (state) => state.addNewError(state), 
    // [types.PROFILE_FOLLOW_ERROR]: (state) => state.addNewError(state),   
    // [types.PROFILE_FREE_AETH_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_GET_LIST_ERROR]: (state) => state.addNewError(state),
    [types.PROFILE_GET_LOCAL_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_REGISTER_ERROR]: (state) => state.addNewError(state),
    [types.PROFILE_TOGGLE_DONATIONS_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_TRANSFER_AETH_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_TRANSFER_ETH_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_TRANSFORM_ESSENCE_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_UNFOLLOW_ERROR]: (state) => state.addNewError(state),
    // [types.PROFILE_UPDATE_ERROR]: (state) => state.addNewError(state),
    // [types.PUBLISH_PROFILE_ERROR]: (state) => state.addNewError(state),
    // [types.REQUEST_FUND_FROM_FAUCET_ERROR]: (state) => state.addNewError(state),
    // [types.SEARCH_QUERY_ERROR]: (state) => state.addNewError(state),
    [types.SEARCH_MORE_QUERY_ERROR]: (state) => state.addNewError(state),
    // an error occured when saving temp profile to IndexedDb
    [types.TEMP_PROFILE_CREATE_ERROR]: (state) => state.addNewError(state),
    // error deleting temp profile from indexedDB.
    // [types.TEMP_PROFILE_DELETE_ERROR]: (state) => state.addNewError(state),
    // error getting temp profile from indexedDB
    [types.TEMP_PROFILE_GET_ERROR]: (state) => state.addNewError(state),
    // error updating temp profile to IndexedDB
    [types.TEMP_PROFILE_UPDATE_ERROR]: (state) => state.addNewError(state),
});

export default errorState;
