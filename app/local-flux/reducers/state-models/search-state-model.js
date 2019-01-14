import { Record, List, Map } from 'immutable';

export const SearchRecord = Record({
    currentPage: null,
    entryIds: new List(),
    flags: new Map(),
    offset: null,
    profiles: new List(),
    profilesAutocomplete: new List(),
    query: '',
    queryAutocomplete: '',
    resultsCount: 0,
    tagResultsCount: 0,
    tags: new List(),
    totalPages: null,
});

export default class SearchStateModel extends SearchRecord {
    getEntryIds = (entries) =>
        entries.map(entry => entry.entryId);
    
}