import { Record, List, Map } from 'immutable';

export const TagRecord = Record({
    entriesCount: new Map(),
    exists: new Map(),
    flags: new Map({
        existsPending: new Map(),
        registerPending: new List(),
        searchPending: false
    }),
    moreNewTags: false,
    searchQuery: null,
    searchResults: new List()
});
