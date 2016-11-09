import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get tagName for tagId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagAtNameRequest) {
    const status = yield contracts.instance.tags.checkFormat(data.tagName);
    return { status, tagName: data.tagName };
});

export default { execute, name: 'checkFormat'};

