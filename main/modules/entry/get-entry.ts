import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { getFullContent } from './ipfs';
import { BASE_URL, FULL_WAIT_TIME, generalSettings, SHORT_WAIT_TIME } from '../../config/settings';
import commentsCount from '../comments/comments-count';
import getProfileData from '../profile/profile-data';

/**
 * Fetch entry from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryGetRequest) {
    const entryEth = yield contracts.instance.entries.getEntry(data.entryId);
    const active = yield contracts.instance.entries.isMutable(data.entryId);
    const score = yield contracts.instance.votes.getScore(data.entryId);
    const cCount = yield commentsCount.execute({ entryId: data.entryId });
    entryEth.publisher = yield getProfileData.execute({ profile: entryEth.publisher, short: true })
        .timeout(SHORT_WAIT_TIME)
        .then((d) => d).catch((e) => null);
    const content = (data.full) ?
        yield getFullContent(entryEth.ipfsHash, data.version)
            .timeout(FULL_WAIT_TIME)
            .then((d) => d).catch((e) => null)
        :
        null;

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

