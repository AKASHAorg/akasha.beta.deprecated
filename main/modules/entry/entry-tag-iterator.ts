import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import getEntry from './get-entry';

/**
 * Get entries indexed by tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { start?: number, limit?: number, tagName: string, reverse: boolean }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.entries.getTagEntryFirst(data.tagName);
    if (currentId === '0') {
        return { collection: [], tagName: data.tagName };
    }
    const maxResults = (data.limit) ? data.limit : 5;
    const fetchCalls = [];
    let counter = 0;
    if (!data.start) {
        fetchCalls.push(getEntry.execute({ entryId: currentId }));
        counter = 1;
    }

    while (counter < maxResults) {
        currentId = (data.reverse) ? yield contracts.instance.entries.getTagEntryPrev(data.tagName, currentId) :
            yield contracts.instance.entries.getTagEntryNext(data.tagName, currentId);
        if (currentId === '0') {
            break;
        }
        fetchCalls.push(getEntry.execute({ entryId: currentId }));
        counter++;
    }
    const results = yield Promise.all(fetchCalls);
    return { collection: results, tagName: data.tagName, limit: maxResults };
});

export default { execute, name: 'entryTagIterator' };

