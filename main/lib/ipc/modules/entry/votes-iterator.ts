import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get individual votes of entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number, entryId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.votes.getFirstVoteId(data.entryId);
    if (currentId === '0') {
        return { collection: [] };
    }
    let row = yield contracts.instance.votes.getVoteOf(data.entryId, currentId);
    let akashaId = yield contracts.instance.profile.getId(row.profile);
    const maxResults = (data.limit) ? data.limit : 30;
    const results = [{ akashaId: akashaId, score: row.score }];
    let counter = 1;
    while (counter < maxResults) {
        currentId = yield contracts.instance.tags.getNextVoteId(data.entryId, currentId);
        if (currentId === '0') {
            break;
        }
        row = yield contracts.instance.votes.getVoteOf(data.entryId, currentId);
        akashaId = yield contracts.instance.profile.getId(row.profile);
        results.push({ akashaId: akashaId, score: row.score });
        counter++;
    }
    return { collection: results, entryId: data.entryId };
});

export default { execute, name: 'votesIterator' };

