import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { BASE_URL, generalSettings, SHORT_WAIT_TIME } from '../../config/settings';
import schema from '../utils/jsonschema';
import { encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
import { profileAddress } from '../profile/helpers';
import { getFullContent, getShortContent } from './ipfs';

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
    const [fn, digestSize, hash] = yield contracts.instance.Entries.getEntry(ethAddress, data.entryId);
    if (!!unpad(hash)) {
        const ipfsHash = encodeHash(fn, digestSize, hash);
        entry = (data.full || data.version) ?
            yield getFullContent(ipfsHash, data.version).timeout(SHORT_WAIT_TIME) :
            yield getShortContent(ipfsHash).timeout(SHORT_WAIT_TIME);
    }

    const [_totalVotes, _score, _endPeriod, _totalKarma, ] = yield contracts.instance.Votes.getRecord(data.entryId);
    // const cCount = yield commentsCount.execute({ entryId: data.entryId });

    return {
        [BASE_URL]: generalSettings.get(BASE_URL),
        totalVotes: _totalVotes.toString(10),
        score: _score.toString(10),
        endPeriod: (new Date(_endPeriod.toNumber() * 1000)).toISOString(),
        totalKarma: _totalKarma.toString(10),
        content: entry,
        // commentsCount: cCount.count
    };
});

export default { execute, name: 'getEntry' };

