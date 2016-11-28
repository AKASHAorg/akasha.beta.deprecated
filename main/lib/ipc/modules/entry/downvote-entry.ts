/*!
 * Copyright akasha
 */

import { module as userModule } from '../auth/index';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Downvote entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntryUpvoteRequest) {
    if (data.weight < 1 || data.weight > 10) {
        throw new Error("Vote weight value must be between 1-10");
    }
    const txData = yield contracts.instance.votes.downvote(data.entryId, data.weight, data.value, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, entryId: data.entryId };
});

export default { execute, name: 'downvote' };
