import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
import entriesDB from './db/entry';
import debug from 'debug';
const dbg = debug('App:EntryService:');

class EntryService {
    constructor () {
        this.listeners = {};
    }
    removeListener = (channel) => {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
        this.listeners[channel] = null;
    };
    saveDraft = (partialDraft) =>
        entriesDB.transaction('rw', entriesDB.drafts, () => {
            if (partialDraft.id) {
                return entriesDB.drafts.update(partialDraft.id, partialDraft).then(updated => {
                    dbg('draft ', partialDraft.id, 'updated');
                    if (updated) {
                        return partialDraft;
                    }
                    return null;
                });
            }
            return entriesDB.drafts.add(partialDraft).then(draftId => {
                dbg('draft with id', draftId, 'created');
                return partialDraft;
            });
        });
    getAllDrafts = () =>
        entriesDB.transaction('rw', entriesDB.drafts, () =>
            entriesDB.drafts.toArray().then(drafts => {
                dbg('getAllDrafts', drafts);
                const convDrafts = drafts.map(draft => {
                    return Object.assign({}, draft);
                });
                return convDrafts;
            })
        );
    getResourceCount = (table) =>
        entriesDB.transaction('rw', entriesDB[table], () =>
            entriesDB[table].count()
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
    publishEntry = (entry, profileAddress) => {
        const serverChannel = EVENTS.server.entry.publish;
        const clientChannel = EVENTS.client.entry.publish;
        entry.account = profileAddress;
        entry.password = "asdasdasd";
        return new Promise((resolve, reject) => {
            ipcRenderer.on(clientChannel, (ev, data) => {
                dbg('publishEntry', data);
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
    };
    getSortedEntries = ({ sortBy }) =>
        entriesDB.transaction('r', entriesDB.drafts, () => {
            if (sortBy === 'rating') {
                return entriesDB.drafts.where('tags').anyOf('top-rating').toArray();
            }
            if (sortBy === 'top') {
                return entriesDB.drafts.sortBy('status.created_at').toArray();
            }
        });
    getSavedEntries = () => {};
    getEntriesForTag = () => {};
}

export { EntryService };
