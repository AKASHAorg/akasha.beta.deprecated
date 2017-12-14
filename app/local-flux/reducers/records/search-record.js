import { Record, List, Map } from 'immutable';

export const SearchRecord = Record({
    currentPage: null,
    entryIds: new List(),
    flags: new Map(),
    profiles: new List(),
    query: '',
    resultsCount: 0,
    tagResultsCount: 0,
    tags: new List(),
    totalPages: null,
});
