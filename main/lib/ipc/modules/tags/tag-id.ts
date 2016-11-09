import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get tagId from tagName
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagAtNameRequest) {
    const tagId = yield contracts.instance.tags.getTagId(data.tagName);
    return { tagId, tagName: data.tagName };
});

export default { execute, name: 'getTagId'};

