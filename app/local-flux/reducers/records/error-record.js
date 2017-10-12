import { List, Map, Record } from 'immutable';

export const ErrorRecord = Record({
    code: null,
    fatal: false,
    from: {},
    id: null,
    message: '',
    messageId: '',
    platform: '',
    values: {}
});

export const ErrorState = Record({
    allIds: new List(),
    byId: new Map(),
    byType: new Map(),
    fatalErrors: new List(),
    nonFatalErrors: new List(),
    reportError: new Map(),
});
