import { List, Map, Record } from 'immutable';

const Flags = Record({
    firstDashboardReady: false
});

const ColumnFlags = Record({
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
    lastIndex: null,
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
