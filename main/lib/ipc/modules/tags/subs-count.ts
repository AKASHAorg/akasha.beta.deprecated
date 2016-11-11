import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get subscription size for a profile id
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {akashaId: string}) {
    const count = yield contracts.instance.feed.subsCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});

export default { execute, name: 'subsCount' };
