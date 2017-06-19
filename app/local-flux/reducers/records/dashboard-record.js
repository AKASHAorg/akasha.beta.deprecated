import { List, Map, Record } from 'immutable';
import { columnType } from '../../../constants/columns';

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
    type: null,
    value: '',
});

export const DashboardRecord = Record({
    akashaId: null,
    columns: new List(),
    id: null,
    name: null,
});

const ids = ['latest', 'tagakasha', 'followingstream', 'profile'];

const defaultDashboard = new DashboardRecord({
    name: 'default',
    columns: new List(ids)
});

export const DashboardState = Record({
    activeDashboard: null,
    allDashboards: new List(),
    dashboardById: new Map({
        // default: defaultDashboard
    }),
    columnById: new Map({
        // [ids[0]]: new ColumnRecord({ id: ids[0], type: columnType.latest }),
        // [ids[1]]: new ColumnRecord({ id: ids[1], type: columnType.tag, value: 'akasha' }),
        // [ids[2]]: new ColumnRecord({ id: ids[2], type: columnType.stream }),
        // [ids[3]]: new ColumnRecord({ id: ids[3], type: columnType.profile, value: 'john.doe' })
    }),
});
