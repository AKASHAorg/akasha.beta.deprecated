import { module as userModule } from '../auth/index';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Upvote entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntryUpvoteRequest) {
    if (data.weight < 1 || data.weight > 10) {
        throw new Error("Vote weight value must be between 1-10");
    }
    const txData = yield contracts.instance.votes.upvote(data.entryId, data.weight, data.value, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, entryId: data.entryId, extra: data.extra };
});

export default { execute, name: 'upvote' };
