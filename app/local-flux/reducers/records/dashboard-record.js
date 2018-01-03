import { List, Map, Record } from 'immutable';

const Flags = Record({
    firstDashboardReady: false,
    renamingDashboard: false
});

const ColumnFlags = Record({
    fetchingEntries: false,
    fetchingMoreEntries: false,
    moreEntries: false
});

export const ColumnRecord = Record({
    id: null,
    entriesList: new List(),
    firstBlock: null,
    flags: new ColumnFlags(),
    hasNewEntries: false,
    large: false,
    lastBlock: null,
    lastIndex: null,
    type: null,
    value: '',
});

export const DashboardRecord = Record({
    columns: new List(),
    ethAddress: null,
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
    byId: new Map(),
    columnById: new Map({
        newColumn: new ColumnRecord()
    }),
    flags: new Flags(),
    newColumn: null,
    newDashboard: false,
    search: null,
});
