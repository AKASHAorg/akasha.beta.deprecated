import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { mixed } from '../models/records';


export const cacheKey = 'search:tags:all';
/**
 * Search a tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { tagName: string, limit: number }) {

    if (!mixed.hasFull(cacheKey)) {
        const filter = contracts.instance.Tags.TagCreate({}, { fromBlock: 0, toBlock: 'latest' });
        yield filter.get().then((collection) => {
            mixed.setFull(cacheKey, collection);
            return true;
        });
    }
    const collection = (mixed.getFull(cacheKey)).filter((currentTag) => {
        return currentTag.includes(data.tagName);
    });

    return { collection };
});

export default { execute, name: 'searchTag' };
