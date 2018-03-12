import {getEntriesCollection} from './db/dbs';
import {genId} from '../../utils/dataModule';
import * as Promise from 'bluebird';

export const draftModify = (draft) => {
    const {id, ...changes} = draft;
    try {
        const modified = getEntriesCollection()
            .findAndUpdate({id: id}, (rec) => Object.assign(rec, changes));
        return Promise.resolve(modified);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftCreate = (draft) => {
    try {
        const record = Object.assign({}, {id: genId()}, draft);
        getEntriesCollection().insert(record);
        return Promise.resolve(record);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftCreateOrUpdate = ({draft}) => {
    const {tags, id, ethAddress, content, localChanges, onChain} = draft;
    try {
        const draftObj = getEntriesCollection().findOne({id: draft.id});
        if (!draftObj) {
            return draftCreate({
                tags,
                id,
                ethAddress,
                content,
                localChanges,
                onChain,
            });
        }
        return draftModify({
            tags,
            id,
            ethAddress,
            content,
            localChanges,
            onChain,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftDelete = ({draftId}) => {
    try {
        getEntriesCollection().findAndRemove({id: draftId});
        return Promise.resolve(draftId);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftsGet = (ethAddress) => {
    try {
        const records = getEntriesCollection().find({ethAddress: ethAddress});
        return Promise.resolve(records);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftGetById = (draftId) => {
    try {
        const record = getEntriesCollection().findOne({id: draftId});
        return Promise.resolve(record);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftSave = (data) => {
    try {
        return draftCreate(data.draft);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftsGetCount = ({ethAddress}) => {
    try {
        const count = getEntriesCollection()
            .count({ethAddress: ethAddress});
        return Promise.resolve(count);
    } catch (error) {
        return Promise.reject(error);
    }
};

