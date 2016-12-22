import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { getShortContent, getFullContent } from './ipfs';
import { generalSettings, BASE_URL } from '../../config/settings';
import commentsCount from '../comments/comments-count';
import getProfileData from '../profile/profile-data';
/**
 * Fetch entry from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntryGetRequest) {
    const entryEth = yield contracts.instance.entries.getEntry(data.entryId);
    const active = yield contracts.instance.entries.isMutable(data.entryId);
    const score = yield contracts.instance.votes.getScore(data.entryId);
    const cCount = yield commentsCount.execute({ entryId: data.entryId });
    entryEth.publisher = yield getProfileData.execute({ profile: entryEth.publisher });
    const content = (data.full) ? yield getFullContent(entryEth.ipfsHash) : yield getShortContent(entryEth.ipfsHash);
    return {
        [BASE_URL]: generalSettings.get(BASE_URL),
        content,
        entryEth,
        entryId: data.entryId,
        score,
        active,
        commentsCount: cCount.count
    };
});

export default { execute, name: 'getEntry' };

