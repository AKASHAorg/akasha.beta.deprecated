import dashboardDB from './db/dashboard';

export const addColumn = ({ dashboardId, type }) =>
    new Promise((resolve, reject) => {
        dashboardDB.columnById.put({ type })
            .then(id =>
                dashboardDB.dashboardById
                    .where('id')
                    .equals(dashboardId)
                    .first()
                    .then((dashboard) => {
                        if (!dashboard) {
                            reject({ message: 'There is no active dashboard' });
                            return;
                        }
                        dashboard.columns = dashboard.columns || [];
                        dashboard.columns.push(id);
                        dashboardDB.dashboardById.put(dashboard)
                            .then(() => resolve(id));
                    })
                    .catch(err => reject(err))
            )
            .catch(err => reject(err));
    });

export const addDashboard = payload =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboardById.put({ ...payload })
            .then(id =>
                dashboardDB.activeDashboard.put({ akashaId: payload.akashaId, name: payload.name })
                    .then(() => resolve(id))
            )
            .catch(err => reject(err));
    });

export const deleteColumn = ({ dashboardId, columnId }) =>
    new Promise((resolve, reject) => {
        dashboardDB.columnById.delete(columnId)
            .then(() =>
                dashboardDB.dashboardById
                    .where('id')
                    .equals(dashboardId)
                    .first()
                    .then((dashboard) => {
                        if (!dashboard) {
                            reject({ message: 'There is no active dashboard' });
                            return;
                        }
                        dashboard.columns = dashboard.columns || [];
                        dashboard.columns = dashboard.columns.filter(id => id !== columnId);
                        dashboardDB.dashboardById.put(dashboard)
                            .then(() => resolve());
                    })
                    .catch(err => reject(err))
            )
            .catch(err => reject(err));
    });

export const deleteDashboard = id =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboardById.delete(id)
            .then(resolve)
            .catch(reject);
    });

export const getActive = akashaId =>
    new Promise((resolve, reject) => {
        dashboardDB.activeDashboard
            .where('akashaId')
            .equals(akashaId)
            .first()
            .then(resolve)
            .catch(reject);
    });

export const getAll = akashaId =>
    new Promise((resolve, reject) => {
        dashboardDB.dashboardById
            .where('akashaId')
            .equals(akashaId)
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const getColumns = () =>
    new Promise((resolve, reject) => {
        dashboardDB.columnById
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const setActive = payload =>
    new Promise((resolve, reject) => {
        dashboardDB.activeDashboard.put({ ...payload })
            .then(resolve)
            .catch(reject);
    });

export const updateColumn = payload =>
    new Promise((resolve, reject) => {
        dashboardDB.columnById
            .where('id')
            .equals(payload.id)
            .first()
            .then((column) => {
                if (!column) {
                    reject({ message: 'Cannot find specified column' });
                    return;
                }
                const newColumn = Object.assign({}, column, payload.changes);
                dashboardDB.columnById
                    .put(newColumn)
                    .then(resolve);
            })
            .catch(err => reject(err));
    });
