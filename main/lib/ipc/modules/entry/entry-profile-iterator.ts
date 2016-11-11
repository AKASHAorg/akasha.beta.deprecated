import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getEntry from './get-entry';
/**
 * Get entries indexed by publisher
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number, akashaId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.entries.getProfileEntryFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let entry = yield getEntry.execute({ entryId: currentId });
    const maxResults = (data.limit) ? data.limit : 5;
    const results = [{ entryId: currentId, content: entry }];
    let counter = 1;
    while (counter < maxResults) {
        currentId = yield contracts.instance.entries.getProfileEntryNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        entry = yield getEntry.execute({ entryId: currentId });
        results.push({ entryId: currentId, content: entry });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId };
});

export default { execute, name: 'entryProfileIterator' };

