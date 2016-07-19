import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import entriesDB from './db/entry';
import tagsDB from './db/tags';
import debug from 'debug';
const dbg = debug('App:EntryService:');

class EntryService {
    constructor () {
        this.listeners = {};
    }
    removeListener = (channel) => {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
        this.listeners[channel] = null;
    }
    saveDraft = (draft) =>
        new Promise((resolve, reject) => {
            entriesDB.transaction('rw', entriesDB.drafts, () => {
                if (draft.id) {
                    return entriesDB.drafts.update(draft.id, draft).then(updated => {
                        dbg('draft ', draft, 'updated');
                        if (updated) {
                            return entriesDB.drafts.get(draft.id)
                                            .then(updatedDraft => resolve(updatedDraft));
                        }
                        return reject(draft);
                    });
                }
                return entriesDB.drafts.add(draft).then(draftId => {
                    dbg('draft with id', draftId, 'created');
                    return entriesDB.drafts.get(draftId).then(foundDraft => resolve(foundDraft));
                });
            });
        });
    getAllDrafts = () =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.toArray().then(drafts => {
                dbg('getAllDrafts', drafts);
                return drafts;
            })
        );
    // get resource by id (drafts or entries);
    getById = (table, id) =>
        entriesDB.transaction('r', entriesDB[table], () => {
            dbg('getById from', table, 'with id', id);
            return entriesDB[table]
                    .where('id')
                    .equals(parseInt(id, 10))
                    .first();
        });
    saveTag = (tag) =>
        tagsDB.transaction('rw', tagsDB.blockTags, () => {
            tagsDB.blockTags.add(tag);
        })
    getTags = (startingIndex) => {
        const serverChannel = EVENTS.server.entry.getTags;
        const clientChannel = EVENTS.client.entry.getTags;

        if (typeof this.listeners[clientChannel] === 'function') {
            return false;
        }
        return new Promise((resolve, reject) => {
            this.listeners[clientChannel] = (ev, data) => {
                dbg('getTags', data);
                if (!data) {
                    const error = new Error('Main Process Crashed!');
                    return reject(error);
                }
                if (!data.success) {
                    const error = new Error(data.status.message);
                    return reject(error);
                }
                return this.saveTag(data.tag).then(results => resolve(results));
            };
            ipcRenderer.on(clientChannel, this.listeners[clientChannel]);
            ipcRenderer.send(serverChannel, startingIndex);
        });
    }
    checkTagExistence = (tag) => {
        const serverChannel = EVENTS.server.entry.tagExists;
        const clientChannel = EVENTS.client.entry.tagExists;

        return new Promise((resolve, reject) => {
            ipcRenderer.on(clientChannel, (ev, data) => {
                if (!data) {
                    const error = new Error('Main Process Crashed!');
                    return reject(error);
                }
                if (!data.success) {
                    return reject(data.status.message);
                }
                return resolve(data);
            });
            ipcRenderer.send(serverChannel, tag);
        });
    }
    createTag = (tag) => {
        const serverChannel = EVENTS.server.entry.addTag;
        const clientChannel = EVENTS.client.entry.addTag;
        return new Promise((resolve, reject) => {
            ipcRenderer.on(clientChannel, (ev, data) => {
                if (!data) {
                    const error = new Error('Main Process Crashed');
                    return reject(error);
                }
                if (!data.success) {
                    return reject(data.status.message);
                }
                return resolve(data);
            });
            ipcRenderer.send(serverChannel, tag);
        });
    }
    publishEntry = (entry) => {
        const serverChannel = EVENTS.server.entry.publish;
        const clientChannel = EVENTS.client.entry.publish;
        return new Promise((resolve, reject) => {
            ipcRenderer.on(clientChannel, (ev, data) => {
                if (!data) {
                    const error = new Error('Main Process Crashed');
                    return reject(error);
                }
                if (!data.success) {
                    return reject(data.status.message);
                }
                return resolve(data);
            });
            ipcRenderer.send(serverChannel, entry);
        });
    }
}

export { EntryService };
