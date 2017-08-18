import { Map, Record } from 'immutable';

export const HighlightRecord = Record({
    account: null,
    content: null,
    entryId: null,
    entryTitle: null,
    entryVersion: null,
    id: null,
    notes: null,
    publisher: null,
    timestamp: null
});

export const HighlightState = Record({
    byId: new Map()
});
