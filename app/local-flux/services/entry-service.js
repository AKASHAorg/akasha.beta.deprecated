import entriesDB from './db/entry';
import BaseService from './base-service';

/** * DELETE THIS *****/
import { generateEntries } from './faker-data';
/** ******************/

const Channel = window.Channel;


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
    publishEntry = ({ entry, profileAddress, onError, onSuccess }) => {
        const serverChannel = Channel.server.entry.publish;
        const clientChannel = Channel.client.entry.publish;
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(onError, onSuccess, clientChannel.channelName)
        }, () => serverChannel.send(entry));
    };
    getResourceCount = ({ table, onError, onSuccess }) =>
        entriesDB.transaction('rw', entriesDB[table], () =>
            entriesDB[table].count()
        )
        .then(counter => onSuccess(counter))
        .catch(reason => onError(reason));

    // get resource by id (drafts or entries);
    getById = ({ table, id, onSuccess, onError }) =>
        entriesDB.transaction('r', entriesDB[table], () => {
            return entriesDB[table]
                    .where('id')
                    .equals(parseInt(id, 10))
                    .first();
        })
        .then(entries => onSuccess(entries))
        .catch(reason => onError(reason));

    getSortedEntries = ({ sortBy }) =>
        new Promise((resolve) => {
            let entries = [];
            if (sortBy === 'rating') {
                entries = generateEntries(1);
                return resolve(entries);
            }
            if (sortBy === 'top') {
                entries = generateEntries(3);
                return resolve(entries);
            }
            entries = generateEntries(2);
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
    createSavedEntry = ({ username, entry, onError, onSuccess }) =>
        entriesDB.transaction('rw', entriesDB.savedEntries, () => {
            entriesDB.savedEntries.add({ username, ...entry.toJS() }).then(() => entry);
        })
        .then(() => onSuccess(entry))
        .catch(reason => onError(reason));

    getSavedEntries = ({ username, onError, onSuccess }) =>
        entriesDB.transaction('r', entriesDB.savedEntries, () =>
            entriesDB.savedEntries.where('username')
                .equals(username)
                .toArray()
        )
        .then(entries => onSuccess(entries))
        .catch(reason => onError(reason));

    getEntriesForTag = () => {};
}

export { EntryService };
