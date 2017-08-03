import { List, Map, Record } from 'immutable';

export const Flags = Record({
    fetchingLists: false
});

export const ListRecord = Record({
    account: null,
    description: null,
    entryIds: new List(),
    id: null,
    name: null,
    timestamp: null,
});

export const ListState = Record({
    byId: new Map()
});
