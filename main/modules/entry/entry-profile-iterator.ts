import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import getEntry from './get-entry';

/**
 * Get entries indexed by publisher
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { start?: number, limit?: number, akashaId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.entries.getProfileEntryFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    const maxResults = (data.limit) ? data.limit : 5;
    const fetchCalls = [];
    let counter = 0;
    if (!data.start) {
        fetchCalls.push(getEntry.execute({ entryId: currentId }));
        counter = 1;
    }

    while (counter < maxResults) {
        currentId = yield contracts.instance.entries.getProfileEntryNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        fetchCalls.push(getEntry.execute({ entryId: currentId }));
        counter++;
    }
    const results = yield Promise.all(fetchCalls);

    return { collection: results, akashaId: data.akashaId, limit: maxResults };
});

export default { execute, name: 'entryProfileIterator' };

