import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { BASE_URL, generalSettings, SHORT_WAIT_TIME } from '../../config/settings';
import schema from '../utils/jsonschema';
import { encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
import { profileAddress } from '../profile/helpers';
import { getFullContent, getShortContent } from './ipfs';
import commentsCount from '../comments/comments-count';
import { GethConnector } from '@akashaproject/geth-connector';
import { dbs } from '../search/indexes';

export const getEntry = {
    'id': '/getEntry',
    'type': 'object',
    'properties': {
        'entryId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'full': { 'type': 'boolean' }
    },
    'required': ['entryId']
};

export const findAuthor = Promise.coroutine(function* (entryId: string) {
    const ev = yield contracts
        .fromEvent(contracts.instance.Entries.Publish, { entryId: entryId },
            0, 1, { reversed: true, lastIndex: 0 });
    if (!ev.results.length) {
        throw new Error('EntryId ' + entryId + ' could not be found.');
    }

    return ev.results[0].args.author;
});
/**
 * Fetch entry from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryGetRequest) {
    const v = new schema.Validator();
    v.validate(data, getEntry, { throwError: true });

    let entry;
    let ethAddress = yield profileAddress(data);
    const votingPeriod = yield contracts.instance.Entries.voting_period();
    if (!ethAddress) {
        ethAddress = yield findAuthor(data.entryId);
    }

    const [fn, digestSize, hash] = yield contracts.instance.Entries.getEntry(ethAddress, data.entryId);
    let ipfsHash;
    if (!!unpad(hash)) {
        ipfsHash = encodeHash(fn, digestSize, hash);
        entry = (data.full || data.version) ?
            yield getFullContent(ipfsHash, data.version).timeout(SHORT_WAIT_TIME).catch(() => null) :
            yield getShortContent(ipfsHash).timeout(SHORT_WAIT_TIME);

        if (entry) {
            dbs.entry.searchIndex.concurrentAdd({}, [{
                id: data.entryId,
                ethAddress: ethAddress,
                title: entry.title,
                excerpt: entry.excerpt,
                version: data.version
            }], (err) => {
                if (err) {
                    console.warn('error storing entry index', err);
                }
            });
        }

    }

    const [_totalVotes, _score, _endPeriod, _totalKarma, _claimed] = yield contracts.instance.Votes.getRecord(data.entryId);
    const cCount = yield commentsCount.execute([data.entryId]);
    return {
        [BASE_URL]: generalSettings.get(BASE_URL),
        ethAddress: ethAddress,
        totalVotes: _totalVotes.toString(10),
        score: _score.toString(10),
        publishDate: (_endPeriod.minus(votingPeriod)).toNumber(),
        endPeriod: _endPeriod.toNumber(),
        totalKarma: (GethConnector.getInstance().web3.fromWei(_totalKarma, 'ether')).toString(10),
        content: entry,
        claimed: _claimed,
        commentsCount: cCount.collection.length ? cCount.collection[0].count : 0,
        ipfsHash: ipfsHash
    };
});

export default { execute, name: 'getEntry' };

