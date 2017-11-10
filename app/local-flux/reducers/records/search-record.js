import { Record, List, Map } from 'immutable';

export const SearchRecord = Record({
    consecutiveQueryErrors: 0,
    currentPage: null,
    errors: new List(),
    flags: new Map(),
    query: '',
    resultsCount: 0,
    tagResultsCount: 0,
    searchService: null,
    showResults: false,
    totalPages: null,
    entryIds: new List(),
    tags: new List()
});
