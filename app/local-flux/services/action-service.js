import actionDB from './db/action';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';

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
                    reject({});
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

export const getAllHistory = (ethAddress, offset, limit) =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('ethAddress')
            .equals(ethAddress)
            .reverse()
            .offset(offset)
            .limit(limit)
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
            .then((data) => {
                const results = data.filter(action => !action.claimed);
                resolve(results);
            })
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

export const updateClaimAction = (ethAddress, entryId) =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('[ethAddress+type]')
            .equals([ethAddress, actionTypes.draftPublish])
            .toArray()
            .then((data) => {
                const action = data.find(act => act.payload.entryId === entryId);
                action.claimed = true;
                actionDB.actions.put(action)
                    .then(() => resolve(action.id));
            })
            .catch(reject);
    });

export const updateClaimVoteAction = (ethAddress, entryId) =>
    new Promise((resolve, reject) => {
        actionDB.actions
            .where('[ethAddress+type]')
            .anyOf([[ethAddress, actionTypes.entryDownvote], [ethAddress, actionTypes.entryUpvote]])
            .toArray()
            .then((data) => {
                const action = data.find(act => act.payload.entryId === entryId);
                action.claimed = true;
                actionDB.actions.put(action)
                    .then(() => resolve(action.id));
            })
            .catch(reject);
    });
