"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ethereumjs_util_1 = require("ethereumjs-util");
const constants_1 = require("@akashaproject/common/constants");
exports.syncEntriesS = {
    id: '/syncEntries',
    type: 'object',
    properties: {
        fromBlock: { type: 'number' },
        following: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['fromBlock', 'following'],
};
function init(sp, getService) {
    const filterFromPublish = Promise.coroutine(function* (data) {
        const following = Array.from(data.following);
        const additionalFilter = (event) => {
            return following.indexOf(event.args.author) !== -1;
        };
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const fetched = yield contracts.fromEventFilter(contracts.instance.Entries.Publish, {}, data.fromBlock, 10000, { lastIndex: 0, reversed: true }, additionalFilter);
        const entries = fetched.results.map((event) => {
            return { author: event.args.author, entryId: event.args.entryId };
        });
        delete fetched.results;
        following.length = 0;
        return { entries, lastBlock: fetched.fromBlock };
    });
    const indexDbEntry = Promise.coroutine(function* (data) {
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const dbs = getService(constants_1.CORE_MODULE.DB_INDEX);
        const [fn, digestSize, hash] = yield contracts.instance
            .Entries.getEntry(data.author, data.entryId);
        if (!!ethereumjs_util_1.unpad(hash)) {
            const ipfsHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
            const entry = yield getService(constants_1.ENTRY_MODULE.ipfs)
                .getShortContent(ipfsHash).timeout(40000);
            dbs.entry.searchIndex.concurrentAdd({}, [{
                    id: data.entryId,
                    ethAddress: data.author,
                    title: entry.title,
                    excerpt: entry.excerpt,
                    version: entry.version,
                }], (err) => {
                if (err) {
                    console.warn('entry:error syncing index', err);
                }
            });
        }
        return {};
    });
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.syncEntriesS, { throwError: true });
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
    const serviceFilterFromPublish = function () {
        return filterFromPublish;
    };
    const serviceIndexDbEntry = function () {
        return indexDbEntry;
    };
    sp().service(constants_1.ENTRY_MODULE.filterFromPublish, serviceFilterFromPublish);
    sp().service(constants_1.ENTRY_MODULE.indexDbEntry, serviceIndexDbEntry);
    const syncEntries = { execute, name: 'syncEntries', hasStream: true };
    const serviceSyncEntries = function () {
        return syncEntries;
    };
    sp().service(constants_1.ENTRY_MODULE.syncEntries, serviceSyncEntries);
    return syncEntries;
}
exports.default = init;
//# sourceMappingURL=sync-entries.js.map