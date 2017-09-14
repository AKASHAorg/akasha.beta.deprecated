import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Get individual votes of entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { start?: number, limit?: number, entryId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.votes.getFirstVoteId(data.entryId);
    if (currentId === '0') {
        return { collection: [] };
    }
    let row;
    let akashaId;
    const maxResults = (data.limit) ? data.limit : 100;
    const results = [];
    let counter = 0;
    if (!data.start) {
        row = yield contracts.instance.votes.getVoteOf(data.entryId, currentId);
        akashaId = yield contracts.instance.profile.getId(row.profile);
        results.push({ akashaId: akashaId, profileAddress: row.profile, score: row.score });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield contracts.instance.votes.getNextVoteId(data.entryId, currentId);
        if (currentId === '0') {
            break;
        }
        row = yield contracts.instance.votes.getVoteOf(data.entryId, currentId);
        akashaId = yield contracts.instance.profile.getId(row.profile);
        results.push({ akashaId: akashaId, profileAddress: row.profile, score: row.score });
        counter++;
    }
    return { collection: results, entryId: data.entryId, limit: maxResults };
});

export default { execute, name: 'votesIterator' };

