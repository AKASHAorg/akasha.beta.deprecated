import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Get subscription size for a profile id
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { akashaId: string }) {
    const count = yield contracts.instance.subs.subsCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});

export default { execute, name: 'subsCount' };
