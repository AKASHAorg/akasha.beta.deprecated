import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get total number of entries posted by profile
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntriesCountRequest) {
    const count = yield contracts.instance.entries.getProfileEntriesCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});

export default { execute, name: 'getProfileEntriesCount' };
