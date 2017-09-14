import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Get total number of entries posted by profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntriesCountTagRequest []) {
    const requests = data.map((tag) => {
        return contracts.instance.entries
            .getTagEntriesCount(tag.tagName)
            .then((count) => {
                return { count, tagName: tag.tagName };
            });
    });
    const collection = yield Promise.all(requests);
    return { collection };
});

export default { execute, name: 'getTagEntriesCount' };
