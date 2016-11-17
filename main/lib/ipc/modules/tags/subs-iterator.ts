import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get a tags from subscription
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number, akashaId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.feed.subsFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let currentName;
    let counter = 0;
    const maxResults = (data.limit) ? data.limit : 10;
    const results = [];
    if (!data.start) {
        currentName = yield contracts.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield contracts.instance.feed.subsNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        currentName = yield contracts.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId };
});

export default { execute, name: 'tagSubIterator' };

