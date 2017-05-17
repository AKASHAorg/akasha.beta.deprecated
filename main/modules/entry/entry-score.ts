import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get score of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { entryId: string }) {
    const score = yield contracts.instance.votes.getScore(data.entryId);
    return { score, entryId: data.entryId };
});

export default { execute, name: 'getScore' };
