import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if an id is subscribed to tag
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { akashaId: string, tagName: string }) {
    const subscribed = yield contracts.instance.subs.isSubscribed(data.akashaId, data.tagName);
    return { subscribed, akashaId: data.akashaId, tagName: data.tagName };
});

export default { execute, name: 'isSubscribed' };
