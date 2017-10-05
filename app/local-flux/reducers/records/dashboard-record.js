import { List, Map, Record } from 'immutable';

export const Flags = Record({
    firstDashboardReady: false
});

export const ColumnFlags = Record({
    fetchingEntries: false,
    fetchingMoreEntries: false,
    moreEntries: false
});

export const ColumnRecord = Record({
    id: null,
    entries: new List(),
    flags: new ColumnFlags(),
    large: false,
    lastBlock: null,
    suggestions: new List(),
    type: null,
    value: '',
});

export const DashboardRecord = Record({
    account: null,
    columns: new List(),
    id: null,
    name: null,
    timestamp: null
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
    dashboardByName: new Map(),
    flags: new Flags(),
    newColumn: null,
    search: null,
});
