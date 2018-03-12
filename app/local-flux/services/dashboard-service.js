import { getDashboardCollection } from './db/dbs';
import {genId} from '../../utils/dataModule';
import * as Promise from 'bluebird';

export const addColumn = ({ dashboardId, type, value }) =>
    new Promise((resolve, reject) => {
        const id = genId();
        let recCopy = null;
        try {
            const updated = getDashboardCollection().chain()
                .find({id: dashboardId, isActive: true})
                .update(record => {
                    recCopy = record.columns ? Array.from(record.columns) : [];
                    recCopy.push({id, index: recCopy.length, type, value});
                    record.columns = recCopy;
                }).data();
            if (!updated) {
                return reject(new Error(`There is no active dashboard ${dashboardId}.`));
            }
            resolve({dashboardId, column: recCopy})
        } catch (error) {
            reject(error);
        }

    });

export const addDashboard = payload =>
    new Promise((resolve, reject) => {
        const timestamp = (new Date()).getTime();
        payload.timestamp = timestamp;
        payload.id = `${timestamp}-${payload.ethAddress}`;
        const { ethAddress } = payload;
        let { name } = payload;
        if (payload.columns && payload.columns.length) {
            payload.columns = payload.columns.map((col, i) => {
                const id = genId();
                return { id, index:i, ...col };
            });
        }
        try {
            // First find currently active dashboard and uncheck it
            getDashboardCollection()
                .findAndUpdate(
                    {ethAddress: ethAddress, isActive: true},
                    (rec) => rec.isActive = false
                );
            let orderIndex = getDashboardCollection().find({ethAddress: ethAddress}).length;
            let taken = true;
            let calculatedName = name;
            let occurrence = 1;
            while (taken) {
                taken = getDashboardCollection().findOne({ethAddress: ethAddress, name: calculatedName});
                if (taken) {
                    calculatedName += `(${occurrence++})`;
                }
            }
            Object.assign(payload, {isActive: true, name: calculatedName, orderIndex: orderIndex});
            getDashboardCollection().insert(payload);
            resolve(payload);
        } catch (error) {
            reject(error);
        }
    });

export const deleteColumn = ({ dashboardId, columnId }) =>
    new Promise((resolve, reject) => {
        let recCopy = null;
        try {
            const updated = getDashboardCollection().chain()
                .find({id: dashboardId, isActive: true})
                .update(record => {
                    const recRef = record.columns || [];
                    record.columns = recRef.filter(col => col.id !== columnId);
                    recCopy = record;
                }).data();

            if (!updated) {
                return reject(new Error(`There is no active dashboard ${dashboardId}.`));
            }
            resolve(recCopy);
        } catch (error) {
            reject(error);
        }
    });

export const deleteDashboard = id =>
    new Promise((resolve, reject) => {
        try {
            resolve(getDashboardCollection().findAndRemove({id: id}));
        } catch (error) {
            reject(error);
        }
    });

export const getActive = ethAddress =>
    new Promise((resolve, reject) => {
        try {
            const active = getDashboardCollection().findOne({ethAddress: ethAddress, isActive:true});
            resolve(active);
        } catch (error) {
            reject(error);
        }
    });

export const getAll = ethAddress =>
    new Promise((resolve, reject) => {
        try {
            const records = getDashboardCollection().chain().find({ethAddress: ethAddress}).simplesort('orderIndex');
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const getDashboardOrder = ethAddress =>
    new Promise((resolve, reject) => {
        try {
            const records = getDashboardCollection().chain().find({ethAddress: ethAddress}).simplesort('orderIndex');
            const extractedList = (records) ? (records.data()).map(row => row.id) : [];
            resolve(extractedList);
        } catch (error) {
            reject(error);
        }
    });

export const setDashboardOrder = ({ ethAddress, order }) =>
    new Promise((resolve, reject) => {
        try {
            getDashboardCollection()
                .findAndUpdate(
                    {ethAddress: ethAddress},
                    rec => {
                        rec.index = order.indexOf(rec.id);
                    });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });

export const getColumns = ({ dashboardId }) =>
    new Promise((resolve, reject) => {
        try {
            const record= getDashboardCollection().findOne({id: dashboardId});
            if (record) {
                return resolve(record.columns);
            }
            resolve([]);
        } catch (error) {
            reject(error);
        }
    });

export const setColumns = ({dashboardId, columns}) =>
    new Promise((resolve, reject) => {
        try {
            getDashboardCollection()
                .findAndUpdate(
                    { id: dashboardId },
                    rec => {
                        rec.columns = rec.columns.map(col =>
                             Object.assign({}, col, {index: columns.indexOf(col.id)})
                        );
                    });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });

export const renameDashboard = ({dashboardId, ethAddress, newName}) =>
    new Promise((resolve, reject) => {
        try {
            let taken = true;
            let calculatedName = newName;
            let occurrence = 1;
            while (taken) {
                taken = getDashboardCollection().findOne({ethAddress: ethAddress, name: calculatedName});
                if (taken) {
                    calculatedName += `(${occurrence++})`;
                }
            }

            getDashboardCollection()
                .findAndUpdate(
                    {id: dashboardId},
                    rec => rec.name = calculatedName
                );
            resolve({dashboardId, newName});
        } catch (error) {
            reject(error);
        }
    });

export const setActive = payload =>
    new Promise((resolve, reject) => {
        try {
            getDashboardCollection()
                .findAndUpdate(
                    {ethAddress: payload.ethAddress, isActive: true},
                    (rec) => rec.isActive = false
                );
            resolve(getDashboardCollection()
                .findAndUpdate(
                    {id: payload.id},
                    (rec) => rec.isActive = true
                ));
        } catch (error) {
            reject(error);
        }
    });

export const toggleColumn = ({ dashboardId, columnType, value }) =>
    new Promise((resolve, reject) => {
        resolve();
        // dashboardDB.dashboards
        //     .where('id')
        //     .equals(dashboardId)
        //     .first()
        //     .then((dashboard) => {
        //         dashboard.columns = dashboard.columns || [];
        //         const index = dashboard.columns
        //             .findIndex(col => col.type === columnType && col.value === value);
        //
        //         if (index === -1) {
        //             dashboard.columns.push({
        //                 id: genId(),
        //                 timestamp: new Date().getTime(),
        //                 type: columnType,
        //                 value
        //             });
        //         } else {
        //             dashboard.columns = dashboard.columns.filter(col =>
        //                 col.type !== columnType || col.value !== value
        //             );
        //         }
        //
        //         dashboardDB.dashboards
        //             .put(dashboard)
        //             .then(() => resolve(dashboard))
        //             .catch(reject);
        //     })
        //     .catch(err => reject(err));
    });

export const updateColumn = ({ dashboardId, id, changes }) =>
    new Promise((resolve, reject) => {
        resolve();
        // dashboardDB.dashboards
        //     .where('id')
        //     .equals(dashboardId)
        //     .first()
        //     .then((dashboard) => {
        //         if (!dashboard) {
        //             reject({ message: 'There is no active dashboard' });
        //             return;
        //         }
        //         const index = dashboard.columns.findIndex(col => col.id === id);
        //         if (index === -1) {
        //             reject({ message: 'Cannot find specified column' });
        //             return;
        //         }
        //         const column = dashboard.columns[index];
        //         const newColumn = Object.assign({}, column, changes);
        //         dashboard.columns[index] = newColumn;
        //         dashboardDB.dashboards
        //             .put(dashboard)
        //             .then(() => resolve(dashboard));
        //     })
        //     .catch(err => reject(err));
    });
