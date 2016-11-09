import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get tagName for tagId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagAtIdRequest) {
    const tagName = yield contracts.instance.tags.getTagName(data.tagId);
    return { tagName, tagId: data.tagId };
});

export default { execute, name: 'getTagName'};

