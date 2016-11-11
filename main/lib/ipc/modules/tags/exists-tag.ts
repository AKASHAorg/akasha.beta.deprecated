import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if provided `tagName` exists
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: TagExistsRequest) {
    const exists = yield contracts.instance.tags.exists(data.tagName);
    return { exists, tagName: data.tagName };
});

export default { execute, name: 'exists' };

