import { getActionCollection } from './db/dbs';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import * as Promise from 'bluebird';

export const deleteAction = id =>
    new Promise((resolve, reject) => {
        try {
            getActionCollection().findAndRemove({id: id});
            resolve();
        } catch (error) {
            reject(error);
        }
    });

export const getActionByTx = tx =>
    new Promise((resolve, reject) => {
        try {
            const record = getActionCollection().findOne({tx: tx});
            resolve(record.id);
        } catch (error) {
            reject(error);
        }
    });

export const getActionsByType = request =>
    new Promise((resolve, reject) => {
        try {
            const records = getActionCollection()
                .chain()
                .find({
                    ethAddress: request.ethAddress,
                    type: {'$in': request.type}
                })
                .simplesort('created', true);
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const getAllHistory = (ethAddress, offset, limit) =>
    new Promise((resolve, reject) => {
        try {
            const records = getActionCollection()
                .chain()
                .find({
                    ethAddress: ethAddress
                })
                .simplesort('created', true)
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
            const records = getActionCollection()
                .chain()
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
            const records = getActionCollection()
                .chain()
                .find({
                    ethAddress: ethAddress,
                    status: actionStatus.publishing
                })
                .simplesort('created', true);
            resolve(records.data());
        } catch (error) {
            reject(error);
        }
    });

export const saveAction = action =>
    new Promise((resolve, reject) => {
        try {
            const record = getActionCollection().findOne({id: action.id});
            if(!record) {
                getActionCollection().insert(
                    Object.assign({}, { created: (new Date()).getTime() }, action)
                );
            }else {
                getActionCollection().chain().find({id: action.id}).update(result => {
                    Object.assign(result, action);
                })
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });

export const updateClaimAction = (ethAddress, entryId) =>
    new Promise((resolve, reject) => {
        try {
            const records = getActionCollection()
                .chain()
                .find({
                    ethAddress: ethAddress,
                    type: actionTypes.draftPublish
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
            resolve(records.data().id);
        } catch (error) {
            reject(error);
        }
    });
