import { List, Map, Record } from 'immutable';

export const Flags = Record({
    fetchingEntries: false,
    fetchingMoreEntries: false,
    moreEntries: false,
});

export const ColumnRecord = Record({
    id: null,
    entries: new List(),
    flags: new Flags(),
    large: false,
    lastBlock: null,
    suggestions: new List(),
    type: null,
    value: '',
});

export const DashboardRecord = Record({
    akashaId: null,
    columns: new List(),
    id: null,
    name: null,
});

export const NewColumnRecord = Record({
    suggestions: new List(),
    type: null,
    value: ''
});

export const DashboardState = Record({
    activeDashboard: null,
    allDashboards: new List(),
    columnById: new Map(),
    dashboardById: new Map(),
    newColumn: null
});
