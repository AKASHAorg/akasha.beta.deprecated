import actionDB from './db/action';
import * as actionStatus from '../../constants/action-status';

export const deleteAction = id =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .delete(id)
            .then(resolve)
            .catch(reject);
    });

export const getActionByTx = tx =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('tx')
            .equals(tx)
            .toArray()
            .then((data) => {
                if (data[0]) {
                    resolve(data[0].id);
                } else {
                    resolve(null);
                }
            })
            .catch(reject);
    });

export const getActionsByType = request =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('[ethAddress+type]')
            .anyOf(request)
            .reverse()
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const getClaimable = request =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('[ethAddress+type]')
            .anyOf(request)
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const getPendingActions = ethAddress =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('[ethAddress+status]')
            .equals([ethAddress, actionStatus.publishing])
            .toArray()
            .then(resolve)
            .catch(reject);
    });

export const saveAction = action =>
    new Promise((resolve, reject) => {
        actionDB.actions.put(action)
            .then(resolve)
            .catch(reject);
    });
