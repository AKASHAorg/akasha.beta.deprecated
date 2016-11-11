import { module as userModule } from '../auth/index';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Unsub from Tag
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: TagCreateRequest) {
    const txData = yield contracts.instance.feed.unSubscribe(data.tagName, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, tagName: data.tagName };
});

export default { execute, name: 'unSubscribe' };
