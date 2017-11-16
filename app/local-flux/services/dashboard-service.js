import dashboardDB from './db/dashboard';
import * as columnTypes from '../../constants/columns';
import { genId } from '../../utils/dataModule';

export const addColumn = ({ dashboardId, type, value }) =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        const id = genId();
        dashboardDB.dashboards
            .where('id')
            .equals(dashboardId)
            .first()
            .then((dashboard) => {
                if (!dashboard) {
                    reject({ message: 'There is no active dashboard' });
                    return;
                }
                const column = { id, timestamp, type, value };
                dashboard.columns = dashboard.columns || [];
                dashboard.columns.push(column);
                dashboardDB.dashboards.put(dashboard)
                    .then(() => resolve({ dashboardId, column }));
            })
            .catch(err => reject(err));
    });

export const addDashboard = payload =>
    new Promise((resolve, reject) => {
        const timestamp = new Date().getTime();
        payload.timestamp = timestamp;
        payload.id = `${timestamp}-${payload.ethAddress}`;
        const { ethAddress } = payload;
        let { name } = payload;
        if (payload.columns && payload.columns.length) {
            payload.columns = payload.columns.map((col) => {
                const id = genId();
                return { id, timestamp, ...col };
            });
        }
        dashboardDB.dashboards
            .where('name')
            .startsWith(name)
            .filter(dashboard => dashboard.ethAddress === ethAddress)
            .toArray()
            .then((data) => {
                /*
                  Check if there is already a dashboard with this name;
                  If there is, append a suffix like "(x)", where x is the smallest
                  integer bigger than 1 that wasn't already used;
                */
                const names = data.map(x => x.name);
                if (names.length && names.includes(name)) {
                    let i = 2;
                    while (names.includes(`${name}(${i})`)) {
                        i++;
                    }
                    name = `${name}(${i})`;
                    payload.name = name;
                }
                dashboardDB.dashboards.put(payload)
                    .then(() =>
                        dashboardDB.activeDashboard.put({ ethAddress, id: payload.id })
                            .then(() => resolve(payload))
                    )
                    .catch(err => reject(err));
            });
    });

export const deleteColumn = ({ dashboardId, columnId }) =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboards
            .where('id')
            .equals(dashboardId)
            .first()
            .then((dashboard) => {
                if (!dashboard) {
                    reject({ message: 'There is no active dashboard' });
                    return;
                }
                dashboard.columns = dashboard.columns || [];
                dashboard.columns = dashboard.columns.filter(col => col.id !== columnId);
                dashboardDB.dashboards.put(dashboard)
                    .then(() => resolve(dashboard));
            })
            .catch(err => reject(err));
    });

export const deleteDashboard = id =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboards.delete(id)
            .then(resolve)
            .catch(reject);
    });

export const getActive = ethAddress =>
    new Promise((resolve, reject) => {
        dashboardDB.activeDashboard
            .where('ethAddress')
            .equals(ethAddress)
            .first()
            .then(resolve)
            .catch(reject);
    });

export const getAll = ethAddress =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboards
            .where('ethAddress')
            .equals(ethAddress)
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const renameDashboard = ({ dashboardId, ethAddress, newName }) =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboards
            .where('name')
            .startsWith(newName)
            .filter(dashboard => dashboard.ethAddress === ethAddress)
            .toArray()
            .then((data) => {
                /*
                Check if there is already a dashboard with this name;
                If there is, append a suffix like "(x)", where x is the smallest
                integer bigger than 1 that wasn't already used;
                */
                const names = data.map(x => x.name);
                if (names.length && names.includes(newName)) {
                    let i = 2;
                    while (names.includes(`${newName}(${i})`)) {
                        i++;
                    }
                    newName = `${newName}(${i})`;
                }
                dashboardDB.dashboards
                    .where('id')
                    .equals(dashboardId)
                    .first()
                    .then((dashboard) => {
                        if (!dashboard) {
                            reject({ message: 'Cannot find dashboard' });
                            return;
                        }
                        dashboard.name = newName;
                        dashboardDB.dashboards
                            .put(dashboard)
                            .then(() => resolve({ dashboardId, newName }));
                    });
            })
            .catch(reject);
    });

export const setActive = payload =>
    new Promise((resolve, reject) => {
        dashboardDB.activeDashboard.put({ ...payload })
            .then(resolve)
            .catch(reject);
    });

export const toggleTagColumn = ({ dashboardId, tag }) =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboards
            .where('id')
            .equals(dashboardId)
            .first()
            .then((dashboard) => {
                dashboard.columns = dashboard.columns || [];
                const index = dashboard.columns
                    .findIndex(col => col.type === columnTypes.tag && col.value === tag);

                if (index === -1) {
                    dashboard.columns.push({
                        id: genId(),
                        timestamp: new Date().getTime(),
                        type: columnTypes.tag,
                        value: tag
                    });
                } else {
                    dashboard.columns = dashboard.columns.filter(col =>
                        col.type !== columnTypes.tag || col.value !== tag
                    );
                }

                dashboardDB.dashboards
                    .put(dashboard)
                    .then(() => resolve(dashboard))
                    .catch(reject);
            })
            .catch(err => reject(err));
    });

export const updateColumn = ({ dashboardId, id, changes }) =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboards
            .where('id')
            .equals(dashboardId)
            .first()
            .then((dashboard) => {
                if (!dashboard) {
                    reject({ message: 'There is no active dashboard' });
                    return;
                }
                const index = dashboard.columns.findIndex(col => col.id === id);
                if (index === -1) {
                    reject({ message: 'Cannot find specified column' });
                    return;
                }
                const column = dashboard.columns[index];
                const newColumn = Object.assign({}, column, changes);
                dashboard.columns[index] = newColumn;
                dashboardDB.dashboards
                    .put(dashboard)
                    .then(() => resolve(dashboard));
            })
            .catch(err => reject(err));
    });
