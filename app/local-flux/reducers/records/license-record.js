import { Map, Record, Set } from 'immutable';

const LicenseRecord = Record({
    description: [],
    id: null,
    label: null,
    parent: null
});

const LicenseState = Record({
    allIds: new Set(),
    byId: new Map(),
});

export { LicenseRecord, LicenseState };
