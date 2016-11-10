import { module as userModule } from '../auth/index';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Remove comment
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: any) {
    const txData = yield contracts.instance.comments.removeComment(data.entryId, data.commentId, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx };
});

export default {execute, name: 'removeComment'};
