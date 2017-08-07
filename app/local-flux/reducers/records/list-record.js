import { List, Map, Record } from 'immutable';

export const Flags = Record({
    fetchingLists: false,
    searching: false
});

export const ListRecord = Record({
    account: null,
    description: null,
    entryIds: new List(),
    id: null,
    moreEntries: false,
    name: null,
    startIndex: 0,
    timestamp: null,
});

export const ListState = Record({
    byName: new Map(),
    flags: new Flags(),
    search: '',
    searchResults: new List()
});
