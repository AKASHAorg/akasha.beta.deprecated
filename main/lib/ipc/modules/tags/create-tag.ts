import { module as userModule } from '../auth/index';
import { create } from '../profile/ipfs';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Create a new Tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagCreateRequest) {
    const txData = yield contracts.instance.tags.add(data.tagName, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, tagName: data.tagName };
});

export default {execute, name: 'create'};
