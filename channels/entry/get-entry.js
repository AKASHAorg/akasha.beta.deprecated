import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
import { COMMENTS_MODULE, COMMON_MODULE, CORE_MODULE, ENTRY_MODULE, GENERAL_SETTINGS, } from '@akashaproject/common/constants';
export const getEntry = {
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
export const findAuthor = function init(sp, getService) {
    const registered = Promise.coroutine(function* (entryId) {
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const ev = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { entryId }, 0, 1, { reversed: true, lastIndex: 0 });
        if (!ev.results.length) {
            throw new Error('EntryId ' + entryId + ' could not be found.');
        }
        return ev.results[0].args.author;
    });
    sp().service(ENTRY_MODULE.findAuthor, { execute: registered });
};
export default function init(sp, getService) {
    findAuthor(sp, getService);
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, getEntry, { throwError: true });
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const web3Api = getService(CORE_MODULE.WEB3_API);
        let entry;
        let ethAddress = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
        const { getFullContent, getShortContent } = getService(ENTRY_MODULE.ipfs);
        const votingPeriod = yield contracts.instance.Entries.voting_period();
        if (!ethAddress) {
            ethAddress = yield getService(ENTRY_MODULE.findAuthor).execute(data.entryId);
        }
        const [fn, digestSize, hash] = yield contracts.instance
            .Entries.getEntry(ethAddress, data.entryId);
        let ipfsHash;
        const st = getService(CORE_MODULE.SETTINGS).get(GENERAL_SETTINGS.OP_WAIT_TIME);
        const dbs = getService(CORE_MODULE.DB_INDEX);
        if (!!unpad(hash)) {
            ipfsHash = getService(COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
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
        const cCount = yield getService(COMMENTS_MODULE.commentsCount).execute([data.entryId]);
        return {
            ethAddress,
            claimed,
            ipfsHash,
            [GENERAL_SETTINGS.BASE_URL]: getService(CORE_MODULE.SETTINGS)
                .get(GENERAL_SETTINGS.BASE_URL),
            totalVotes: totalVotes.toString(10),
            score: score.toString(10),
            publishDate: (endPeriod.minus(votingPeriod)).toNumber(),
            endPeriod: endPeriod.toNumber(),
            totalKarma: (web3Api.instance.utils.fromWei(totalKarma, 'ether')).toString(10),
            content: entry,
            commentsCount: cCount.collection.length ? cCount.collection[0].count : 0,
        };
    });
    const registered = { execute, name: 'getEntry' };
    const service = function () {
        return registered;
    };
    sp().service(ENTRY_MODULE.getEntry, service);
    return registered;
}
//# sourceMappingURL=get-entry.js.map