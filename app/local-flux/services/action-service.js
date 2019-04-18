import { akashaDB, getActionCollection } from './db/dbs';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import * as Promise from 'bluebird';

export const deleteAction = id => {
    try {
        getActionCollection().findAndRemove({ id: id });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getActionByTx = tx => {
    try {
        const record = getActionCollection().findOne({ tx: tx });
        return Promise.resolve(record.id);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getActionsByType = request => {
    try {
        const records = getActionCollection()
            .chain()
            .find({
                ethAddress: request.ethAddress,
                type: { '$in': request.type }
            })
            .simplesort('created', true);
        return Promise.resolve(Array.from(records.data()));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllHistory = (ethAddress, offset, limit) => {
    try {
        const records = getActionCollection()
            .chain()
            .find({
                ethAddress: ethAddress
            })
            .simplesort('created', true)
            .offset(offset)
            .limit(limit);
        return Promise.resolve(Array.from(records.data()));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getClaimable = request => {
    try {
        const records = getActionCollection()
            .chain()
            .find({
                ethAddress: request.ethAddress,
                type: { '$in': request.type }
            })
            .where(rec => !rec.claimed)
            .simplesort('created', false)
            .data();
        return Promise.resolve(Array.from(records));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPendingActions = ethAddress => {
    try {
        const records = getActionCollection()
            .chain()
            .find({
                ethAddress: ethAddress,
                status: actionStatus.publishing
            })
            .simplesort('created', true);
        return Promise.resolve(Array.from(records.data()));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const saveAction = action => {
    try {
        const record = getActionCollection().findOne({ id: action.id });
        if (!record) {
            getActionCollection().insert(
                Object.assign({}, { created: (new Date()).getTime() }, action)
            );
        } else {
            getActionCollection().chain().find({ id: action.id }).update(result => {
                Object.assign(result, action);
            })
        }
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateClaimAction = (ethAddress, entryId) => {
    try {
        const records = getActionCollection()
            .chain()
            .find({
                ethAddress: ethAddress,
                type: actionTypes.draftPublish
            })
            .where(obj => obj.payload.entryId === entryId)
            .update(action => action.claimed = true);
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => records.data().id);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateClaimVoteAction = (ethAddress, entryId) => {
    try {
        const records = getActionCollection()
            .chain()
            .find({
                '$or': [
                    {
                        ethAddress: ethAddress,
                        type: actionTypes.entryDownvote
                    },
                    {
                        ethAddress: ethAddress,
                        type: actionTypes.entryUpvote
                    }]
            })
            .where(obj => obj.payload.entryId === entryId)
            .update(action => action.claimed = true);
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => records.data().id);
    } catch (error) {
        return Promise.reject(error);
    }
};
