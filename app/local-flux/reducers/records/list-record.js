import { List, Map, Record } from 'immutable';

const Flags = Record({
    fetchingLists: false,
    searching: false,
    updatingLists: false
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
    entryLists: new Map(),
    flags: new Flags(),
    search: '',
    searchResults: new List()
});
