import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.tags.getFirstTag();
    if (currentId === '0') {
        return { collection: [] };
    }
    let currentName;
    const maxResults = (data.limit) ? data.limit : 10;
    const results = [];
    let counter = 0;
    if (!data.start) {
        currentName = yield contracts.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = yield contracts.instance.tags.getNextTag(currentId);
        if (currentId === '0') {
            break;
        }
        currentName = yield contracts.instance.tags.getTagName(currentId);
        results.push({ tagId: currentId, tagName: currentName });
        counter++;
    }
    return { collection: results };
});

export default { execute, name: 'tagIterator' };

