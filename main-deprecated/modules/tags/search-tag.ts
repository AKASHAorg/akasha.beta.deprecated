import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { mixed } from '../models/records';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';

const searchTag = {
    'id': '/searchTag',
    'type': 'object',
    'properties': {
        'tagName': { 'type': 'string', 'minLength': 2 },
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
        yield Promise.fromCallback((cb) => filter.get(cb)).then((collection) => {
            const tags = collection.map((el) => {
               return  GethConnector.getInstance().web3.toUtf8(el.args.tag);
            });
            mixed.setFull(cacheKey, tags);
            return true;
        });
    }
    const collection = (mixed.getFull(cacheKey)).filter((currentTag) => {
        return currentTag.includes(data.tagName);
    });

    return { collection };
});

export default { execute, name: 'searchTag' };
