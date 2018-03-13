import * as Promise from 'bluebird';
import {getSearchCollection} from './db/dbs';

const LAST_ENTRY_TYPE = 'lastEntry';
const LAST_TAG_TYPE = 'lastTag';

export const getLastEntriesBlock = ethAddress => {
    try {
        const record = getSearchCollection().findOne({id: ethAddress, opType: LAST_ENTRY_TYPE});
        return Promise.resolve(record?  record.blockNr: 0);
    }catch (error) {
        return Promise.reject(error);
    }
};

export const getLastTagsBlock = type => {
    try {
        const record = getSearchCollection().findOne({opType: LAST_TAG_TYPE, id: type});
        return Promise.resolve(record ? record.blockNr: 0);
    }catch (error) {
        return Promise.reject(error);
    }
};

export const updateLastEntriesBlock = ({ ethAddress, blockNr }) => {
    try {
        const record = getSearchCollection().findOne({id: ethAddress, opType: LAST_ENTRY_TYPE});
        if(record) {
            getSearchCollection()
                .findAndUpdate(
                    {id: ethAddress, opType: LAST_ENTRY_TYPE},
                    rec => rec.blockNr = blockNr);
        } else {
            getSearchCollection().insert({id: ethAddress, opType: LAST_ENTRY_TYPE, blockNr: blockNr})
        }
        return Promise.resolve(true);
    }catch (error) {
        return Promise.reject(error);
    }
};

export const updateLastTagsBlock = ({ type, blockNr }) => {
    try {
        const record = getSearchCollection().findOne({id: type, opType: LAST_TAG_TYPE});
        if(record) {
            getSearchCollection()
                .findAndUpdate(
                    {id: type, opType: LAST_TAG_TYPE},
                    rec => rec.blockNr = blockNr);
        } else {
            getSearchCollection().insert({id: type, opType: LAST_TAG_TYPE, blockNr: blockNr})
        }
        return Promise.resolve(true);
    }catch (error) {
        return Promise.reject(error);
    }
};
