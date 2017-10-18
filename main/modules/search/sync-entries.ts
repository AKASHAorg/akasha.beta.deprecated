import * as Promise from 'bluebird';
import { dbs } from './indexes';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
import { getShortContent } from '../entry/ipfs';

export const syncEntries = {
    'id': '/syncEntries',
    'type': 'object',
    'properties': {
        'fromBlock': { 'type': 'number' },
        'following': {
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'uniqueItems': true,
            'minItems': 1
        }
    },
    'required': ['fromBlock', 'following']
};

const filterFromPublish = Promise.coroutine(function* (data: { fromBlock: number, following: string[] }) {
    const following = Array.from(data.following);
    const additionalFilter = (event) => {
        return following.indexOf(event.args.author) !== -1;
    };
    const fetched = yield contracts.fromEventFilter(contracts.instance.Entries.Publish, {}, data.fromBlock,
        10000, { lastIndex: 0, reversed: true }, additionalFilter);

    const entries = fetched.results.map((event) => {
        return { author: event.args.author, entryId: event.args.entryId };
    });
    delete fetched.results;
    following.length = 0;

    return { entries, lastBlock: fetched.fromBlock };
});

const indexDbEntry = Promise.coroutine(function* (data: { author: string, entryId: string }) {
    const [fn, digestSize, hash] = yield contracts.instance.Entries.getEntry(data.author, data.entryId);
    if (!!unpad(hash)) {
        const ipfsHash = encodeHash(fn, digestSize, hash);
        const entry = yield getShortContent(ipfsHash).timeout(40000);

        dbs.entry.searchIndex.concurrentAdd({}, [{
            id: data.entryId,
            ethAddress: data.author,
            title: entry.title,
            excerpt: entry.excerpt,
            version: entry.version
        }], (err) => {
            if (err) {
                console.warn('entry:error syncing index', err);
            }
        });
    }

    return {};
});


const execute = Promise.coroutine(function* (data: { fromBlock: number, following: string[] }, cb) {
    const v = new schema.Validator();
    v.validate(data, syncEntries, { throwError: true });

    if (!data.following || !data.following.length) {
        return {};
    }
    const entryList = yield filterFromPublish({ fromBlock: data.fromBlock, following: data.following });
    delete data.following;
    const indexEntry = (i) => {
        if (i === entryList.entries.length) {
            return cb('', { done: true, lastBlock: entryList.lastBlock });
        }
        const nextId = i + 1;
        return indexDbEntry(entryList.entries[i])
            .then(() => indexEntry(nextId))
            .catch(() => indexEntry(nextId));
    };
    indexEntry(0);

    return { done: false };
});

export default { execute, name: 'syncEntries', hasStream: true };
