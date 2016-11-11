import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get total number of entries posted by profile
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntriesCountTagRequest) {
    const count = yield contracts.instance.entries.getTagEntriesCount(data.tagName);
    return { count, tagName: data.tagName };
});

export default { execute, name: 'getTagEntriesCount' };
