import Dexie from 'dexie';

const dbName = `dashboard-akasha-alpha-${process.env.NODE_ENV}`;
const dashboardDB = new Dexie(dbName);
dashboardDB.version(1).stores({
    activeDashboard: '&account',
    dashboards: '&id, account, name, columns',
});

export default dashboardDB;
