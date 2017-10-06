import { Map, Record, Set } from 'immutable';

export const LicenseRecord = Record({
    description: [],
    id: null,
    label: null,
    parent: null
});

export const LicenseState = Record({
    allIds: new Set(),
    byId: new Map(),
});
