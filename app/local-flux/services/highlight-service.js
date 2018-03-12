import {getHighlightCollection} from './db/dbs';
import * as Promise from 'bluebird';

export const deleteHighlight = (id) => {
    try {
        const removed = getHighlightCollection().findAndRemove({id: id});
        return Promise.resolve(removed);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const editNotes = ({id, notes}) => {
    try {
        const record = getHighlightCollection()
            .findAndUpdate({id: id}, rec => rec.notes = notes);
        return Promise.resolve(record);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAll = (ethAddress) => {
    try {
        const records = getHighlightCollection().find({ethAddress: ethAddress});
        return Promise.resolve(records);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const saveHighlight = (highlight) => {
    try {
        const timestamp = (new Date()).getTime();
        highlight['timestamp'] = timestamp;
        highlight['id'] = `${timestamp}-${highlight.ethAddress}`;
        getHighlightCollection().insert(highlight);
        return Promise.resolve(highlight);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const searchHighlight = ({ethAddress, search}) => {
    try {
        const records = getHighlightCollection()
            .chain()
            .find({ethAddress: ethAddress})
            .where(highlight => {
                let {content = '', notes = ''} = highlight;
                content = content.toLowerCase();
                notes = notes.toLowerCase();
                return content.includes(search) || notes.includes(search);
            }).data();
        return Promise.resolve(records.map(highlight => highlight.id));
    } catch (error) {
        return Promise.reject(error);
    }
};
