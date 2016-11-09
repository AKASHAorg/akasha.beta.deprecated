import { module as userModule } from '../auth/index';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Subscribe to a Tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagCreateRequest) {
    const txData = yield contracts.instance.feed.subscribe(data.tagName, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, tagName: data.tagName };
});

export default {execute, name: 'subscribe'};
