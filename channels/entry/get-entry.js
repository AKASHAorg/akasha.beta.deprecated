"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ethereumjs_util_1 = require("ethereumjs-util");
const constants_1 = require("@akashaproject/common/constants");
exports.getEntry = {
    id: '/getEntry',
    type: 'object',
    properties: {
        entryId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        full: { type: 'boolean' },
    },
    required: ['entryId'],
};
exports.findAuthor = function init(sp, getService) {
    const registered = Promise.coroutine(function* (entryId) {
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const ev = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { entryId }, 0, 1, { reversed: true, lastIndex: 0 });
        if (!ev.results.length) {
            throw new Error('EntryId ' + entryId + ' could not be found.');
        }
        return ev.results[0].args.author;
    });
    sp().service(constants_1.ENTRY_MODULE.findAuthor, { execute: registered });
};
function init(sp, getService) {
    exports.findAuthor(sp, getService);
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.getEntry, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        let entry;
        let ethAddress = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const { getFullContent, getShortContent } = getService(constants_1.ENTRY_MODULE.ipfs);
        const votingPeriod = yield contracts.instance.Entries.voting_period();
        if (!ethAddress) {
            ethAddress = yield getService(constants_1.ENTRY_MODULE.findAuthor).execute(data.entryId);
        }
        const [fn, digestSize, hash] = yield contracts.instance
            .Entries.getEntry(ethAddress, data.entryId);
        let ipfsHash;
        const st = getService(constants_1.CORE_MODULE.SETTINGS).get(constants_1.GENERAL_SETTINGS.OP_WAIT_TIME);
        const dbs = getService(constants_1.CORE_MODULE.DB_INDEX);
        if (!!ethereumjs_util_1.unpad(hash)) {
            ipfsHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
            entry = (data.full || data.version) ?
                yield getFullContent(ipfsHash, data.version)
                    .timeout(st).catch(() => null) :
                yield getShortContent(ipfsHash).timeout(st);
            if (entry) {
                dbs.entry.searchIndex.concurrentAdd({}, [{
                        id: data.entryId,
                        ethAddress,
                        title: entry.title,
                        excerpt: entry.excerpt,
                        version: data.version,
                    }], (err) => {
                    if (err) {
                        console.warn('error storing entry index', err);
                    }
                });
            }
        }
        const [totalVotes, score, endPeriod, totalKarma, claimed] = yield contracts.instance
            .Votes.getRecord(data.entryId);
        const cCount = yield getService(constants_1.COMMENTS_MODULE.commentsCount).execute([data.entryId]);
        return {
            [constants_1.GENERAL_SETTINGS.BASE_URL]: getService(constants_1.CORE_MODULE.SETTINGS)
                .get(constants_1.GENERAL_SETTINGS.BASE_URL),
            ethAddress,
            totalVotes: totalVotes.toString(10),
            score: score.toString(10),
            publishDate: (endPeriod.minus(votingPeriod)).toNumber(),
            endPeriod: endPeriod.toNumber(),
            totalKarma: (web3Api.instance.fromWei(totalKarma, 'ether')).toString(10),
            content: entry,
            claimed,
            commentsCount: cCount.collection.length ? cCount.collection[0].count : 0,
            ipfsHash,
        };
    });
    const registered = { execute, name: 'getEntry' };
    const service = function () {
        return registered;
    };
    sp().service(constants_1.ENTRY_MODULE.getEntry, service);
    return registered;
}
exports.default = init;
//# sourceMappingURL=get-entry.js.map