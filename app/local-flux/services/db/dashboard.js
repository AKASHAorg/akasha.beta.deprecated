import Dexie from 'dexie';

const dbName = `dashboard-akasha-alpha-${process.env.NODE_ENV}`;
const dashboardDB = new Dexie(dbName);
dashboardDB.version(1).stores({
    activeDashboard: '&ethAddress',
    dashboards: '&id, ethAddress, name, columns',
});

export default dashboardDB;
