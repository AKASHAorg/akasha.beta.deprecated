import { List, Map, Record } from 'immutable';
import { profileComments, profileEntries, profileFollowings,
    profileFollowers } from '../../../constants/columns';

const Flags = Record({
    firstDashboardReady: false,
    renamingDashboard: false
});

const ColumnFlags = Record({
    fetchingItems: false,
    fetchingMoreItems: false,
    moreItems: false
});

export const ColumnRecord = Record({
    id: null,
    itemsList: new List(),
    firstBlock: null,
    firstIndex: 0,
    flags: new ColumnFlags(),
    newItems: new List(), // a list of newly published entryIds
    large: false,
    lastBlock: null,
    lastIndex: 0,
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
        newColumn: new ColumnRecord(),
        profileComments: new ColumnRecord({ id: profileComments, type: profileComments }),
        // profileEntries: new ColumnRecord({ id: profileEntries, type: profileEntries }),
        profileFollowers: new ColumnRecord({ id: profileFollowers, type: profileFollowers }),
        profileFollowings: new ColumnRecord({ id: profileFollowings, type: profileFollowings }),        
    }),
    flags: new Flags(),
    newColumn: null,
    newDashboard: false,
    search: null,
});
