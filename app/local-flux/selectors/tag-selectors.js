import { createSelector } from 'reselect';

export const selectTagEntriesCount = state => state.tagState.get('entriesCount');

export const selectTagExists = state => state.tagState.get('exists');
