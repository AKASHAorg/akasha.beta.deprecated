import Dexie from 'dexie';

const dbName = `dashboard-akasha-alpha-${process.env.NODE_ENV}`;
const dashboardDB = new Dexie(dbName);
dashboardDB.version(1).stores({
    activeDashboard: '&akashaId',
    columnById: '++id',
    dashboardById: '++id, akashaId, name',
});

export default dashboardDB;
