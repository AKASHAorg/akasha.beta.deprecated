import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { mixed } from '../models/records';
import schema from '../utils/jsonschema';

const searchTag = {
    'id': '/searchTag',
    'type': 'object',
    'properties': {
        'tagName': { 'type': 'string' },
        'limit': { 'type': 'number' },
    },
    'required': ['tagName', 'limit']
};


export const cacheKey = 'search:tags:all';
/**
 * Search a tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { tagName: string, limit: number }) {
    const v = new schema.Validator();
    v.validate(data, searchTag, { throwError: true });

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
