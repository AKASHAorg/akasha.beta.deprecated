import actionDB from './db/action';
import * as actionStatus from '../../constants/action-status';

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
                    reject({});
                }
            })
            .catch(reject);
    });

export const getPendingActions = akashaId =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('[akashaId+status]')
            .equals([akashaId, actionStatus.publishing])
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