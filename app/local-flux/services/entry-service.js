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
        this.clientManager = Channel.client.entry.manager;
    }

    /**
     *  Publish a new entry
     *
     */
    publishEntry = ({ draft, token, gas, onError, onSuccess }) => {
        console.log(draft, 'sending draft to main for publishing');
        const {
            title,
            featuredImage,
            excerpt,
            licence,
            tags,
            content,
            wordCount
        } = draft;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.publish,
            clientChannel: Channel.client.entry.publish,
            listenerCb: this.createListener(onError, onSuccess)
        }, () =>
            Channel.server.entry.publish.send({
                content: {
                    title,
                    featuredImage,
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
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getProfileEntriesCount,
            clientChannel: Channel.client.entry.getProfileEntriesCount,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.entry.getProfileEntriesCount.send({ akashaId }));
    };

    entryProfileIterator = ({ akashaId, start, limit, onSuccess, onError }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.entryProfileIterator,
            clientChannel: Channel.client.entry.entryProfileIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.entry.entryProfileIterator.send({ akashaId, start, limit }));
    }

    moreEntryProfileIterator = ({ akashaId, start, limit, onError = () => {}, onSuccess }) =>
        this.registerListener(
            Channel.client.entry.entryProfileIterator,
            this.createListener(onError, onSuccess),
            () => Channel.server.entry.entryProfileIterator.send({ akashaId, start, limit })
        );

    // get resource by id (drafts or entries);
    getById = ({ table, id, onSuccess, onError }) =>
        entriesDB[table]
            .where('id')
            .equals(parseInt(id, 10))
            .first()
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

    saveEntry = ({ akashaId, entry, onError, onSuccess }) =>
        entriesDB.savedEntries.where('akashaId').equals(akashaId)
            .toArray()
            .then(records => {
                let result;
                if (!records.length) {
                    result = { akashaId, entries: [entry] };
                } else {
                    records[0].entries.push(entry);
                    result = { akashaId, entries: records[0].entries }
                }
                return entriesDB.savedEntries.put(result)
                    .then(() => onSuccess(entry))
                    .catch(reason => onError(reason));
            })
            .catch(reason => onError(reason));

    deleteEntry = ({ akashaId, entryId, onError, onSuccess }) =>
        entriesDB.savedEntries.where('akashaId').equals(akashaId)
            .toArray()
            .then(records => {
                let result;
                if (!records.length) {
                    return;
                } else {
                    const entries = records[0].entries.filter(entry =>
                        entry.entryId !== entryId);
                    result = { akashaId, entries }
                }
                return entriesDB.savedEntries.put(result)
                    .then(() => onSuccess(entryId))
                    .catch(reason => onError(reason));
            })
            .catch(reason => onError(reason));

    getSavedEntries = ({ akashaId, onError = () => {}, onSuccess }) =>
        entriesDB.savedEntries.where('akashaId')
            .equals(akashaId)
            .first()
            .then(result => onSuccess(result ? result.entries : []))
            .catch(reason => onError(reason));

    getEntryList = ({ entries, onError = () => {}, onSuccess }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getEntryList,
            clientChannel: Channel.client.entry.getEntryList,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.getEntryList.send(entries);
        });
    }

    moreEntryList = ({ entries, onError = () => {}, onSuccess }) => {
        this.registerListener(
            Channel.client.entry.getEntryList,
            this.createListener(onError, onSuccess),
            () => Channel.server.entry.getEntryList.send(entries)
        );
    }

    entryTagIterator = ({ tagName, start, limit, onError = () => {}, onSuccess }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.entryTagIterator,
            clientChannel: Channel.client.entry.entryTagIterator,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.entryTagIterator.send({ tagName, start, limit });
        });
    };

    moreEntryTagIterator = ({ tagName, start, limit, onError = () => {}, onSuccess }) =>
        this.registerListener(
            Channel.client.entry.entryTagIterator,
            this.createListener(onError, onSuccess),
            () => Channel.server.entry.entryTagIterator.send({ tagName, start, limit })
        );

    getTagEntriesCount = ({
        tagName, onError = () => {
    }, onSuccess
    }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getTagEntriesCount,
            clientChannel: Channel.client.entry.getTagEntriesCount,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.getTagEntriesCount.send({ tagName });
        });

    getLicences = ({ onSuccess, onError }) => {
        this.openChannel({
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
    };

    getEntriesStream = ({
        akashaId, onError = () => {
    }, onSuccess
    }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getEntriesStream,
            clientChannel: Channel.client.entry.getEntriesStream,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.getEntriesStream.send({ akashaId });
        });
    }

    voteCost = ({ weight, onError = () => {}, onSuccess }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.voteCost,
            clientChannel: Channel.client.entry.voteCost,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.voteCost.send({ weight });
        });

    upvote = ({ token, entryId, weight, value, gas = 2000000, onError = () => {}, onSuccess }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.upvote,
            clientChannel: Channel.client.entry.upvote,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.upvote.send({ token, entryId, weight, value, gas });
        });


    downvote = ({ token, entryId, weight, value, gas = 2000000, onError = () => {}, onSuccess }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.downvote,
            clientChannel: Channel.client.entry.downvote,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.downvote.send({ token, entryId, weight, value, gas });
        });

    getEntry = ({ entryId, full = false, onError = () => {}, onSuccess }) => {
        this.registerListener(
            Channel.client.entry.getEntry,
            this.createListener(onError, onSuccess)
        );
        Channel.server.entry.getEntry.send({ entryId, full });
    };

    getScore = ({ entryId, onError = () => {}, onSuccess }) => {
        this.registerListener(
            Channel.client.entry.getScore,
            this.createListener(onError, onSuccess)
        );
        Channel.server.entry.getScore.send({ entryId });
    };

    isActive = ({ entryId, onError = () => {}, onSuccess }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.isActive,
            clientChannel: Channel.client.entry.isActive,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.isActive.send({ entryId });
        });

    getVoteOf = ({ akashaId, entryId, onError = () => {}, onSuccess }) =>
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.entry.getVoteOf,
            clientChannel: Channel.client.entry.getVoteOf,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.entry.getVoteOf.send({ akashaId, entryId });
        });
}

export { EntryService };
