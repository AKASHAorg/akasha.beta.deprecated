import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { BASE_URL, generalSettings, SHORT_WAIT_TIME } from '../../config/settings';
import schema from '../utils/jsonschema';
import { encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
import { profileAddress } from '../profile/helpers';
import { getFullContent, getShortContent } from './ipfs';
import commentsCount from '../comments/comments-count';
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
/**
 * Fetch entry from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryGetRequest) {
    const v = new schema.Validator();
    v.validate(data, getEntry, { throwError: true });

    let entry;
    const ethAddress = yield profileAddress(data);
    const votingPeriod = yield contracts.instance.Entries.voting_period();
    const [fn, digestSize, hash] = yield contracts.instance.Entries.getEntry(ethAddress, data.entryId);
    if (!!unpad(hash)) {
        const ipfsHash = encodeHash(fn, digestSize, hash);
        entry = (data.full || data.version) ?
            yield getFullContent(ipfsHash, data.version).timeout(SHORT_WAIT_TIME) :
            yield getShortContent(ipfsHash).timeout(SHORT_WAIT_TIME);

        dbs.entry.searchIndex.concurrentAdd({}, [{
            id: data.entryId,
            ethAddress: ethAddress,
            title: entry.title,
            excerpt: entry.excerpt,
            version: data.version
        }], (err) => { if (err) { console.warn('error storing index', err); } });
    }

    const [_totalVotes, _score, _endPeriod, _totalKarma,] = yield contracts.instance.Votes.getRecord(data.entryId);
    const cCount = yield commentsCount.execute([data.entryId]);
    return {
        [BASE_URL]: generalSettings.get(BASE_URL),
        totalVotes: _totalVotes.toString(10),
        score: _score.toString(10),
        publishDate: (_endPeriod.minus(votingPeriod)).toNumber(),
        endPeriod: _endPeriod.toNumber(),
        totalKarma: _totalKarma.toString(10),
        content: entry,
        commentsCount: cCount.collection.length ? cCount.collection[0].count : 0
    };
});

export default { execute, name: 'getEntry' };

