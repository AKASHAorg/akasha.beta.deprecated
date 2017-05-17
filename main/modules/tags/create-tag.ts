import auth from '../auth/Auth';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Create a new Tag
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: TagCreateRequest) {
    const txData = yield contracts.instance.tags.add(data.tagName, data.gas);
    const tx = yield auth.signData(txData, data.token);
    return { tx, tagName: data.tagName };
});

export default { execute, name: 'create' };
