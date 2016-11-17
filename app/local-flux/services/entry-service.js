import entriesDB from './db/entry';
import BaseService from './base-service';

/** * DELETE THIS *****/
import { generateEntries } from './faker-data';
/** ******************/

const Channel = window.Channel;


/**
 * Entry service
 * channels => ['publish', 'update', 'upvote', 'downvote', 'isOpenedToVotes', 'getVoteOf',
 *  'getVoteEndDate', 'getScore', 'getEntriesCount', 'getEntryOf', 'getEntry', 'getEntriesCreated',
 *  'getVotesEvent']
 * default open channels => ['getVoteEndDate', 'getScore', 'getEntry']
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
    publishEntry = ({ draft, token, gas, onError, onSuccess }) => {
        console.log('publish entry service');
        const {
            title,
            featuredImage,
            excerpt,
            licence,
            tags,
            content,
            wordCount
        } = draft;
        console.log('featuredImage', featuredImage);
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.publish,
            clientChannel: Channel.client.entry.publish,
            listenerCb: this.createListener(onError, onSuccess)
        }, () =>
            Channel.server.entry.publish.send({
                content: {
                    title,
                    featuredImage: new Uint8Array(20000), // please fix me
                    excerpt,
                    licence,
                    draft: content,
                    wordCount
                },
                tags,
                token,
                gas
            }));
    };

    getEntriesCount = ({ akashaId, onError, onSuccess }) => {
        console.log({ akashaId });
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getProfileEntriesCount,
            clientChannel: Channel.client.entry.getProfileEntriesCount,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.entry.getProfileEntriesCount.send({ akashaId }));
    };

    getProfileEntries = ({ akashaId, onSuccess, onError }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.entryProfileIterator,
            clientChannel: Channel.client.entry.entryProfileIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.entry.entryProfileIterator.send({ akashaId }));
    }

    // get resource by id (drafts or entries);
    getById = ({ table, id, onSuccess, onError }) =>
        entriesDB.transaction('r', entriesDB[table], () =>
            entriesDB[table]
                .where('id')
                .equals(parseInt(id, 10))
                .first()
        )
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

    createSavedEntry = ({ akashaId, entry, onError, onSuccess }) =>
        entriesDB.transaction('rw', entriesDB.savedEntries, () => {
            entriesDB.savedEntries.add({ akashaId, ...entry.toJS() }).then(() => entry);
        })
            .then(() => onSuccess(entry))
            .catch(reason => onError(reason));

    getSavedEntries = ({ akashaId, onError, onSuccess }) =>
        entriesDB.transaction('r', entriesDB.savedEntries, () =>
            entriesDB.savedEntries.where('akashaId')
                .equals(akashaId)
                .toArray()
        )
            .then(entries => onSuccess(entries))
            .catch(reason => onError(reason));

    getEntriesForTag = () => {};

    getLicences = ({ onSuccess, onError }) => {
        this.openChannel({
            serverManager: Channel.server.licenses.manager,
            clientManager: Channel.client.licenses.manager,
            serverChannel: Channel.server.licenses.getLicenses,
            clientChannel: Channel.client.licenses.getLicenses,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.licenses.getLicenses.send();
        });
    };
    getLicencesById = ({ id, onSuccess, onError }) => {
        this.registerListener(
            Channel.client.licenses.getLicenceById,
            this.createListener(onError, onSuccess),
            () => Channel.server.licenses.getLicenceById({ id })
        );
    }
}

export { EntryService };
