import { akashaDB, getDashboardCollection } from './db/dbs';
import { genId } from '../../utils/dataModule';
import * as Promise from 'bluebird';

export const addColumn = ({ dashboardId, type, value }) => {
    const id = genId();
    let recCol = null;
    try {
        const updated = getDashboardCollection()
            .chain()
            .find({ id: dashboardId, isActive: true })
            .update(record => {
                const recCopy = record.columns ? Array.from(record.columns) : [];
                recCol = { id, index: recCopy.length, type, value };
                recCopy.push(recCol);
                record.columns = recCopy;
            })
            .data();
        if (!updated) {
            return Promise.reject(new Error(`There is no active dashboard ${dashboardId}.`));
        }
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => ({
            dashboardId,
            id: id,
            column: recCol
        }));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const addDashboard = payload => {
    const timestamp = new Date().getTime();
    payload.timestamp = timestamp;
    payload.id = `${timestamp}-${payload.ethAddress}`;
    const { ethAddress } = payload;
    let { name } = payload;
    if (payload.columns && payload.columns.length) {
        payload.columns = payload.columns.map((col, i) => {
            const id = genId();
            return { id, index: i, ...col };
        });
    }
    try {
        // First find currently active dashboard and uncheck it
        getDashboardCollection().findAndUpdate(
            { ethAddress: ethAddress, isActive: true },
            rec => (rec.isActive = false)
        );
        let orderIndex = getDashboardCollection().find({ ethAddress: ethAddress }).length;
        let taken = true;
        let calculatedName = name;
        let occurrence = 1;
        while (taken) {
            taken = getDashboardCollection().findOne({ ethAddress: ethAddress, name: calculatedName });
            if (taken) {
                calculatedName += `(${occurrence++})`;
            }
        }
        Object.assign(payload, { isActive: true, name: calculatedName, orderIndex: orderIndex });
        getDashboardCollection().insert(payload);
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => payload);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteColumn = ({ dashboardId, columnId }) => {
    let recCopy = null;
    try {
        getDashboardCollection()
            .chain()
            .find({ id: dashboardId, isActive: true })
            .update(record => {
                const recRef = record.columns || [];
                record.columns = recRef.filter(col => col.id !== columnId);
                recCopy = record;
            })
            .data();

        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => recCopy);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteDashboard = id => {
    try {
        getDashboardCollection().findAndRemove({ id: id });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getActive = ethAddress => {
    try {
        const active = getDashboardCollection().findOne({ ethAddress: ethAddress, isActive: true });
        if (active && active.columns) {
            active.columns.sort((a, b) => a.index - b.index);
        }
        return Promise.resolve(active);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAll = ethAddress => {
    try {
        const records = getDashboardCollection()
            .chain()
            .find({ ethAddress: ethAddress })
            .simplesort('orderIndex');
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => records.data());
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getDashboardOrder = ethAddress => {
    try {
        const records = getDashboardCollection()
            .chain()
            .find({ ethAddress: ethAddress })
            .simplesort('orderIndex');
        const extractedList = records ? records.data().map(row => row.id) : [];
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => extractedList);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const setDashboardOrder = ({ ethAddress, order }) => {
    try {
        getDashboardCollection().findAndUpdate({ ethAddress: ethAddress }, rec => {
            rec.orderIndex = order.indexOf(rec.id);
        });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getColumns = ({ dashboardId }) => {
    try {
        const record = getDashboardCollection().findOne({ id: dashboardId });
        if (record) {
            return Promise.resolve(record.columns);
        }
        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const setColumns = ({ dashboardId, columns }) => {
    try {
        getDashboardCollection().findAndUpdate({ id: dashboardId }, rec => {
            rec.columns = rec.columns.map(col => Object.assign({}, col, { index: columns.indexOf(col.id) }));
        });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const renameDashboard = ({ dashboardId, ethAddress, newName }) => {
    try {
        let taken = true;
        let calculatedName = newName;
        let occurrence = 1;
        while (taken) {
            taken = getDashboardCollection().findOne({ ethAddress: ethAddress, name: calculatedName });
            if (taken) {
                calculatedName += `(${occurrence++})`;
            }
        }

        getDashboardCollection().findAndUpdate({ id: dashboardId }, rec => (rec.name = calculatedName));
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => ({ dashboardId, newName }));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const setActive = payload => {
    try {
        getDashboardCollection().findAndUpdate(
            { ethAddress: payload.ethAddress, isActive: true },
            rec => (rec.isActive = false)
        );
        getDashboardCollection().findAndUpdate({ id: payload.id }, rec => (rec.isActive = true));
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const toggleColumn = ({ dashboardId, columnType, value }) => {
    try {
        getDashboardCollection().findAndUpdate({ id: dashboardId }, dashboard => {
            dashboard['columns'] = dashboard.columns || [];
            const index = dashboard.columns.findIndex(col => col.type === columnType && col.value === value);

            if (index === -1) {
                dashboard.columns.push({
                    id: genId(),
                    timestamp: new Date().getTime(),
                    type: columnType,
                    value
                });
            } else {
                dashboard.columns = dashboard.columns.filter(
                    col => col.type !== columnType || col.value !== value
                );
            }
            return dashboard;
        });
        const record = getDashboardCollection().findOne({ id: dashboardId });
        return Promise.fromCallback(cb => akashaDB.save(cb)).then(() => record);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateColumn = ({ dashboardId, id, changes }) => {
    try {
        const record = getDashboardCollection().findAndUpdate({ id: dashboardId }, dashboard => {
            if (!dashboard) {
                return;
            }
            const index = dashboard.columns.findIndex(col => col.id === id);
            if (index === -1) {
                return;
            }
            const column = dashboard.columns[index];
            dashboard.columns[index] = Object.assign({}, column, changes);
        });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => record);
    } catch (error) {
        return Promise.reject(error);
    }
};
