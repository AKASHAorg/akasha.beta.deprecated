import debug from 'debug';
import entriesDB from './db/entry';
import BaseService from './base-service';

const Channel = window.Channel;
const dbg = debug('App:EntryService:');

/** * DELETE THIS *****/
import { generateEntries } from './faker-data';
/** ******************/

/**
 * Entry service
 * default open channels =>
 */
class EntryService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.entry.manager;
        this.clientManager = Channel.client.entry.manager;
    }
    /**
     *  Publish a new entry
     *
     */
    publishEntry = (entry, profileAddress) => {
        const serverChannel = Channel.server.entry.publish;
        const clientChannel = Channel.client.entry.publish;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                dbg('publishEntry', res);
                if (res.error) {
                    return reject(res.error);
                }
                return resolve(res);
            };
            return this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () => serverChannel.send(entry));
        });
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
    createSavedEntry = (username, entry) =>
        entriesDB.transaction('rw', entriesDB.savedEntries, () => {
            entriesDB.savedEntries.add({ username, ...entry.toJS() }).then(entryId => {
                dbg('new savedEntry created with id', entryId);
                return entry;
            });
        });

    getSavedEntries = (username) =>
        entriesDB.transaction('r', entriesDB.savedEntries, () => {
            dbg('getting saved entries for username ', username);
            return entriesDB.savedEntries.where('username')
                                         .equals(username)
                                         .toArray();
        });

    getEntriesForTag = () => {};
}

export { EntryService };
