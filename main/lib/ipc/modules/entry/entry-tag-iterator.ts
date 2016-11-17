import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getEntry from './get-entry';
/**
 * Get entries indexed by tag
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number, tagName: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.entries.getTagEntryFirst(data.tagName);
    if (currentId === '0') {
        return { collection: [], tagName: data.tagName };
    }
    let entry;
    const maxResults = (data.limit) ? data.limit : 5;
    const results = [];
    let counter = 0;
    if (!data.start) {
        entry = yield getEntry.execute({ entryId: currentId });
        results.push({ entryId: currentId, content: entry });
        counter = 1;
    }

    while (counter < maxResults) {
        currentId = yield contracts.instance.entries.getTagEntryNext(data.tagName, currentId);
        if (currentId === '0') {
            break;
        }
        entry = yield getEntry.execute({ entryId: currentId });
        results.push({ entryId: currentId, content: entry });
        counter++;
    }
    return { collection: results, tagName: data.tagName };
});

export default { execute, name: 'entryTagIterator' };

