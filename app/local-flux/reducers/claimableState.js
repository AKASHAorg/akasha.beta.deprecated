import { List } from 'immutable';
import ClaimableStateModel, { ClaimableEntry } from './state-models/claimable-state-model';
import * as types from '../constants';
import { createReducer } from './utils';

const initialState = new ClaimableStateModel();

const claimableState = createReducer(initialState, {

    [types.CLAIMABLE_DELETE_ENTRY]: (state, { entryId }) => {
        const entriesLoading = state.get('entriesLoading').filter(entryId => entryId !== entryId);
        const entriesLoadingMore = state.get('entriesLoadingMore')
            .filter(entryId => entryId !== entryId);
        const entryList = state.get('entryList').filter(entry => entry.entryId !== entryId);
        return state.merge({
            entriesLoading,
            entriesLoadingMore,
            entryList,
        });
    },

    [types.CLAIMABLE_DELETE_LOADING]: (state, { entryId }) =>
        state.merge({
            entriesLoading: state.get('entriesLoading').filter(id => id !== entryId),
            entriesLoadingMore: state.get('entriesLoadingMore').filter(id => id !== entryId),
        }),

    [types.CLAIMABLE_GET_ENTRIES]: (state, { more }) => {
        if (more) {
            return state.set('fetchingMoreEntries', true);
        }
        return state.set('fetchingEntries', true);
    },

    [types.CLAIMABLE_GET_ENTRIES_ERROR]: (state, { request }) => {
        if (request.more) {
            return state.set('fetchingMoreEntries', false);
        }
        return state.set('fetchingEntries', false);
    },

    [types.CLAIMABLE_GET_ENTRIES_SUCCESS]: (state, { data, request }) => {
        let entryList = request.more ? state.get('entryList') : List();
        let entriesLoading = state.get('entriesLoading');
        let entriesLoadingMore = state.get('entriesLoadingMore');
        data.forEach((entry) => {
            if (request.more) {
                entriesLoadingMore = entriesLoadingMore.push(entry.entryId);
            } else {
                entriesLoading = entriesLoading.push(entry.entryId);
            }
            if (!entryList.find(claimable => claimable.entryId === entry.entryId)) {
                entryList = entryList.push(new ClaimableEntry(entry));
            }
        });
        return state.merge({
            entriesLoading,
            entriesLoadingMore,
            entryList,
            fetchingEntries: request.more ? state.get('fetchingEntries') : false,
            fetchingMoreEntries: request.more ? false : state.get('fetchingMoreEntries'),
            moreEntries: data.length === request.limit,
        });
    },

    // [types.ENTRY_GET_SHORT_ERROR]: (state, { request }) => {
    //     const { entryId } = request;
    //     const index = state.get('entryList').findIndex(entry => entry.entryId === entryId);

    //     if (index !== -1) {
    //         return state.merge({
    //             entriesLoading: state.get('entriesLoading').filter(id => id !== entryId),
    //             entriesLoadingMore: state.get('entriesLoadingMore')
    //                 .filter(id => id !== entryId),
    //         });
    //     }
    //     return state;
    // },

    // [types.ENTRY_GET_SHORT_SUCCESS]: (state, { request }) => {
    //     const { entryId } = request;
    //     const index = state.get('entryList').findIndex(entry => entry.entryId === entryId);

    //     if (index !== -1) {
    //         return state.merge({
    //             entriesLoading: state.get('entriesLoading').filter(id => id !== entryId),
    //             entriesLoadingMore: state.get('entriesLoadingMore')
    //                 .filter(id => id !== entryId),                
    //         });
    //     }
    //     return state;
    // },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,
});

export default claimableState;
