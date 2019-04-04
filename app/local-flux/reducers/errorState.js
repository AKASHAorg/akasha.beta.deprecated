//@flow strict
import { Map, fromJS } from 'immutable';
import { createReducer } from './utils';
import ErrorStateModel from './state-models/error-state-model';
import * as types from '../constants';
/* ::
    import type { ActionParams } from '../../flow-types/actions/action';
 */
const initialState = new ErrorStateModel();

const errorState = createReducer(initialState, {
    [types.BACKUP_KEYS_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    // [types.COMMENTS_DOWNVOTE_ERROR]: (state, action/* : ActionParams */) =>
    //    state.addNewError(state, action),
    // [types.COMMENTS_PUBLISH_ERROR]: (state, action/* : ActionParams */) =>
    //    state.addNewError(state, action),
    // [types.COMMENTS_UPVOTE_ERROR]: (state, action/* : ActionParams */) => state.addNewError(state, action),
    [types.DASHBOARD_ADD_COLUMN_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.DASHBOARD_ADD_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.DASHBOARD_DELETE_COLUMN_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.DASHBOARD_GET_ACTIVE_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.DASHBOARD_GET_ALL_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.DASHBOARD_SET_ACTIVE_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.DASHBOARD_UPDATE_COLUMN_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.DRAFT_CREATE_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.DRAFT_UPDATE_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.ENTRIES_GET_AS_DRAFTS_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.DRAFT_PUBLISH_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.DRAFT_PUBLISH_UPDATE_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    // [types.ENTRY_CLAIM_ERROR]: (state, action/* : ActionParams */) => state.addNewError(state, action),
    // [types.ENTRY_CLAIM_VOTE_ERROR]: (state, action/* : ActionParams */) =>
    //      state.addNewError(state, action),
    // [types.ENTRY_DOWNVOTE_ERROR]: (state, action/* : ActionParams */) => state.addNewError(state, action),
    // [types.ENTRY_GET_FULL_ERROR]: (state, action/* : ActionParams */) => state.addNewError(state, action),
    // [types.ENTRY_UPVOTE_ERROR]: (state, action/* : ActionParams */) => state.addNewError(state, action),
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
    [types.SHOW_REPORT_MODAL]: (state, action /* : ActionParams */) =>
        state.merge({
            reportError: fromJS(action.payload)
        }),
    [types.HIDE_REPORT_MODAL]: state =>
        state.merge({
            reportError: new Map()
        }),
    [types.GET_APP_SETTINGS_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.GENERAL_SETTINGS_SAVE_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.GETH_SAVE_SETTINGS_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.GETH_SETTINGS_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.IPFS_SAVE_SETTINGS_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.IPFS_SETTINGS_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.PROFILE_FAUCET_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.PROFILE_GET_LOCAL_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.PROFILE_TOGGLE_DONATIONS_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.SEARCH_MORE_QUERY_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.TEMP_PROFILE_CREATE_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action),
    [types.TEMP_PROFILE_GET_ERROR]: (state, action /* : ActionParams */) => state.addNewError(state, action),
    [types.TEMP_PROFILE_UPDATE_ERROR]: (state, action /* : ActionParams */) =>
        state.addNewError(state, action)
});

export default errorState;
