import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get subscription size for a profile address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {profileAddress: string}) {
    const count = yield contracts.instance.feed.subsCount(data.profileAddress);
    return { count, profileAddress: data.profileAddress };
});

export default {execute, name: 'subsCount'};
