import actionCollection from './db/action';
import * as actionStatus from '../../constants/action-status';

export const deleteAction = id =>
    new Promise((resolve, reject) => {
        try {
            console.log('deleteAction');
            actionCollection.findAndRemove({id: id});
            resolve();
        } catch (error) {
            reject(error);
        }
    });

export const getActionByTx = tx =>
    new Promise((resolve, reject) => {
        try {
            console.log('getActionByTx');
            const record = actionCollection.findOne({tx: tx});
            resolve(record.id);
        } catch (error) {
            reject(error);
        }
    });

export const getActionsByType = request =>
    new Promise((resolve, reject) => {
        try {
            console.log('getActionsByType');
            const records = actionCollection
                .find({
                    ethAddress: request.ethAddress,
                    type: {'$in': request.type}
                })
                .simplesort('created', false);
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const getAllHistory = (ethAddress, offset, limit) =>
    new Promise((resolve, reject) => {
        try {
            console.log('getAllHistory');
            const records = actionCollection
                .find({
                    ethAddress: ethAddress
                })
                .simplesort('created', false)
                .offset(offset)
                .limit(limit);
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const getClaimable = request =>
    new Promise((resolve, reject) => {
        try {
            console.log('getClaimable');
            const records = actionCollection
                .find({
                    ethAddress: request.ethAddress,
                    type: {'$in': request.type},
                    claimed: false
                })
                .simplesort('created', false);
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const getPendingActions = ethAddress =>
    new Promise((resolve, reject) => {
        try {
            console.log('getPendingActions');
            const records = actionCollection
                .find({
                    ethAddress: ethAddress,
                    type: actionStatus.publishing
                })
                .simplesort('created', false);
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const saveAction = action =>
    new Promise((resolve, reject) => {
        try {
            console.log('saveAction');
            actionCollection.insert(
                Object.assign({}, { created: (new Date()).getTime() }, action)
            );
            resolve();
        } catch (error) {
            reject(error);
        }
    });

export const updateClaimAction = (ethAddress, entryId) =>
    new Promise((resolve, reject) => {
        try {
            console.log('updateClaimAction');
            const records = actionCollection
                .find({
                    ethAddress: ethAddress,
                    type: actionStatus.draftPublish
                })
                .where(obj => obj.payload.entryId === entryId)
                .update(action => action.claimed = true);
            resolve(records.data().id);
        } catch (error) {
            reject(error);
        }
    });

export const updateClaimVoteAction = (ethAddress, entryId) =>
    new Promise((resolve, reject) => {
        try {
            console.log('updateClaimVoteAction');
            const records = actionCollection
                .find({
                    '$or': [
                        {
                            ethAddress: ethAddress,
                            type: actionStatus.entryDownvote
                        },
                        {
                            ethAddress: ethAddress,
                            type: actionStatus.entryUpvote
                        }]
                })
                .where(obj => obj.payload.entryId === entryId)
                .update(action => action.claimed = true);
            resolve(records.data().id);
        } catch (error) {
            reject(error);
        }
    });
