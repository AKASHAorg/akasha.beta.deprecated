import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Get total number of tags
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    const count = yield contracts.instance.Tags.total();
    return { count: count.toString(10) };
});

export default { execute, name: 'tagCount' };

