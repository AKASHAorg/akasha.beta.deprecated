import { List } from 'immutable';
import { ClaimableEntry, ClaimableState } from './records';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = new ClaimableState();

const claimableState = createReducer(initialState, {

    [types.CLAIMABLE_DELETE_ENTRY_SUCCESS]: (state, { data }) => {
        const entriesLoading = state.get('entriesLoading').filter(entryId => entryId !== data.entryId);
        const entriesLoadingMore = state.get('entriesLoadingMore')
            .filter(entryId => entryId !== data.entryId);                
        const entryList = state.get('entryList').filter(entry => entry.entryId !== data.entryId);
        return state.merge({
            entriesLoading,
            entriesLoadingMore,
            entryList,
        });
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
            moreEntries: data.length === request.limit,
        });
    },

    [types.ENTRY_GET_SHORT_SUCCESS]: (state, { data, request }) => {
        const { entryId } = request;
        const index = state.get('entryList').findIndex(entry => entry.entryId === entryId);
        
        if (index !== -1) {
            return state.merge({
                entriesLoading: state.get('entriesLoading').filter(id => id !== entryId),
                entriesLoadingMore: state.get('entriesLoadingMore')
                    .filter(id => id !== entryId),                
                entryList: state.get('entryList').setIn([index, 'endPeriod'], data.endPeriod)
            });
        }
        return state;
    },

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,
});

export default claimableState;
