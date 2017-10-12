import { Map } from 'immutable';
import { createReducer } from './create-reducer';
import { ErrorRecord } from './records';
import { ErrorModel } from './models';
import * as types from '../constants';

const initialState = new ErrorModel();
const newError = (state, error) => {
    const err = new ErrorRecord(error);
    const lastErr = state.get('byId').last();
    const id = lastErr ? lastErr.get('id') + 1 : 1;
    return err.set('id', id);
};
const addNewError = (state, { error }) => {
    const err = newError(state, error);
    const extra = err.fatal ?
        { fatalErrors: state.get('fatalErrors').push(err.id) } :
        null;

    return state.merge({
        allIds: state.get('allIds').push(err.id),
        byId: state.get('byId').set(err.id, err),
        ...extra
    });
};

const errorState = createReducer(initialState, {
    [types.BACKUP_KEYS_ERROR]: addNewError,
    [types.DASHBOARD_ADD_COLUMN_ERROR]: addNewError,
    [types.DASHBOARD_ADD_ERROR]: addNewError,
    [types.DASHBOARD_DELETE_COLUMN_ERROR]: addNewError,
    [types.DASHBOARD_GET_ACTIVE_ERROR]: addNewError,
    [types.DASHBOARD_GET_ALL_ERROR]: addNewError,
    [types.DASHBOARD_SET_ACTIVE_ERROR]: addNewError,
    [types.DASHBOARD_UPDATE_COLUMN_ERROR]: addNewError,
    [types.DRAFT_CREATE_ERROR]: addNewError,
    [types.DRAFT_UPDATE_ERROR]: addNewError,
    [types.ENTRIES_GET_AS_DRAFTS_ERROR]: addNewError,
    [types.DRAFT_PUBLISH_ERROR]: addNewError,
    [types.ENTRY_CLAIM_ERROR]: addNewError,
    [types.ENTRY_DOWNVOTE_ERROR]: addNewError,
    [types.ENTRY_GET_FULL_ERROR]: addNewError,
    [types.ENTRY_UPVOTE_ERROR]: addNewError,
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
    [types.SHOW_REPORT_MODAL]: (state, { data }) => {
        return state.merge({
            reportError: new Map(data.error)
        });
    },
    [types.HIDE_REPORT_MODAL]: state =>
        state.merge({
            reportError: new Map()
        }),
    [types.ETH_ADDRESS_CREATE_ERROR]: addNewError,
    [types.FUND_FROM_FAUCET_ERROR]: addNewError,
    [types.GENERAL_SETTINGS_ERROR]: addNewError,
    [types.GENERAL_SETTINGS_SAVE_ERROR]: addNewError,
    [types.GETH_GET_OPTIONS_ERROR]: addNewError,
    [types.GETH_GET_STATUS_ERROR]: addNewError,
    [types.GETH_SAVE_SETTINGS_ERROR]: addNewError,
    [types.GETH_SETTINGS_ERROR]: addNewError,
    [types.GETH_START_ERROR]: addNewError,
    [types.GETH_STOP_ERROR]: addNewError,
    [types.IPFS_GET_CONFIG_ERROR]: addNewError,
    [types.IPFS_GET_PORTS_ERROR]: addNewError,
    [types.IPFS_GET_STATUS_ERROR]: addNewError,
    [types.IPFS_SAVE_SETTINGS_ERROR]: addNewError,
    [types.IPFS_SET_PORTS_ERROR]: addNewError,
    [types.IPFS_SETTINGS_ERROR]: addNewError,
    [types.IPFS_START_ERROR]: addNewError,
    [types.IPFS_STOP_ERROR]: addNewError,
    [types.PROFILE_BOND_AETH_ERROR]: addNewError,
    [types.PROFILE_CYCLE_AETH_ERROR]: addNewError,
    [types.PROFILE_GET_LIST_ERROR]: addNewError,
    [types.PROFILE_GET_LOCAL_ERROR]: addNewError,
    [types.PUBLISH_PROFILE_ERROR]: addNewError,
    [types.REQUEST_FUND_FROM_FAUCET_ERROR]: addNewError,
    [types.SEARCH_QUERY_ERROR]: addNewError,
    [types.SEARCH_MORE_QUERY_ERROR]: addNewError,
    // an error occured when saving temp profile to IndexedDb
    [types.TEMP_PROFILE_CREATE_ERROR]: addNewError,
    // error deleting temp profile from indexedDB.
    [types.TEMP_PROFILE_DELETE_ERROR]: addNewError,
    // error getting temp profile from indexedDB
    [types.TEMP_PROFILE_GET_ERROR]: addNewError,
    // error updating temp profile to IndexedDB
    [types.TEMP_PROFILE_UPDATE_ERROR]: addNewError,
});

export default errorState;
