import { module as userModule } from '../auth/index';
import { create } from './ipfs';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Create a new comment
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: any) {
    const hash = yield create(data.content);
    const txData = yield contracts.instance.comments.comment(hash, data.entryId, data.gas, data.parent);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx };
});

export default { execute, name: 'comment' };
