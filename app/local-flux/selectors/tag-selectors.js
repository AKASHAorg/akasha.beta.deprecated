// @flow

export const selectTagEntriesCount = (state /*: Object */) => state.tagState.get('entriesCount');
export const selectTagExists = (state /*: Object */) => state.tagState.get('exists');
export const selectTagFlags = (state /*: Object */) => state.tagState.get('flags');

export const getTagSearchPending = (state /*: Object */) => selectTagFlags(state).get('searchPending');
