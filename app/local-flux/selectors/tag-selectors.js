// @flow
import { createSelector } from 'reselect';

export const selectTagEntriesCount = (state/*: Object */) => state.tagState.get('entriesCount');
export const selectTagExists = (state/*: Object */) => state.tagState.get('exists');
