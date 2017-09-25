import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Get total number of tags
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    const count = yield contracts.instance.Tags.total();
    return { count };
});

export default { execute, name: 'getTagCount' };

