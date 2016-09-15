import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
import entriesDB from './db/entry';
import debug from 'debug';
const dbg = debug('App:EntryService:');

/** * DELETE THIS *****/
import { generateEntries } from './faker-data';
/** ******************/

class EntryService {
    constructor () {
        this.listeners = {};
    }
    removeListener = (channel) => {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
        this.listeners[channel] = null;
    };
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
        new Promise((resolve, reject) => {
            let entries = [];
            if (sortBy === 'rating') {
                entries = generateEntries(1);
                dbg('getting entries by rating', entries);
                return resolve(entries);
            }
            if (sortBy === 'top') {
                entries = generateEntries(3);
                dbg('getting top entries', entries);
                return resolve(entries);
            }
            entries = generateEntries(2);
            dbg('getting entries by', sortBy, entries);
            return resolve(entries);
        });
        // entriesDB.transaction('r', entriesDB.drafts, () => {
        //     if (sortBy === 'rating') {
        //         return entriesDB.drafts.where('tags').anyOf('top-rating').toArray();
        //     }
        //     if (sortBy === 'top') {
        //         return entriesDB.drafts.sortBy('status.created_at').toArray();
        //     }
        // });
    createSavedEntry = (userName, entry) =>
        entriesDB.transaction('rw', entriesDB.savedEntries, () => {
            entriesDB.savedEntries.add({ userName, ...entry.toJS() }).then(entryId => {
                dbg('new savedEntry created with id', entryId);
                return entry;
            });
        });

    getSavedEntries = (userName) =>
        entriesDB.transaction('r', entriesDB.savedEntries, () => {
            dbg('getting saved entries for username ', userName);
            return entriesDB.savedEntries.where('userName')
                                         .equals(userName)
                                         .toArray();
        });

    getEntriesForTag = () => {};
}

export { EntryService };
