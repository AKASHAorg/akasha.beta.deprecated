import {akashaDB, getEntriesCollection} from './db/dbs';
import {genId} from '../../utils/dataModule';
import * as Promise from 'bluebird';

export const draftModify = (draft) => {
    const {id, ...changes} = draft;
    try {
        getEntriesCollection()
            .findAndUpdate({id: id}, (rec) => Object.assign(rec, changes));
        return Promise.fromCallback(cb => akashaDB.save(cb)).then(() => draftGetById(id));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftCreate = (draft) => {
    try {
        const record = Object.assign({}, {id: genId()}, draft);
        const inserted = getEntriesCollection().insert(record);
        return Promise.fromCallback(cb => akashaDB.save(cb)).then(() => Object.assign({}, inserted));
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
        return Promise.fromCallback(cb => akashaDB.save(cb)).then(() => draftId);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftsGet = (ethAddress) => {
    try {
        const records = getEntriesCollection().find({ethAddress: ethAddress});
        return Promise.resolve(records.slice(0));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftGetById = (draftId) => {
    try {
        const record = getEntriesCollection().findOne({id: draftId});
        return Promise.resolve(Object.assign({}, record));
    } catch (error) {
        return Promise.reject(error);
    }
};

export const draftSave = (data) => {
    try {
        return draftCreate(Object.assign({},data.draft));
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

