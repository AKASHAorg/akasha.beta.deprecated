import auth from '../auth/Auth';
import { create } from './ipfs';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Create a new comment
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: any) {
    const hash = yield create(data.content);
    const txData = yield contracts.instance.comments.comment(data.entryId, hash, data.gas, data.parent);
    const tx = yield auth.signData(txData, data.token);
    return { tx };
});

export default { execute, name: 'comment' };
