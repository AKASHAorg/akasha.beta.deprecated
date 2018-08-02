import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../core/jsonschema';
import { web3Api } from '../../services';
import resolve from '../profile/resolve-ethaddress';
const buildFilter = {
    'id': '/buildFilter',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
    },
    'required': ['toBlock']
};
const execute = Promise.coroutine(function* (data) {
    const v = new schema.Validator();
    v.validate(data, buildFilter, { throwError: true });
    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts.fromEvent(contracts.instance.Entries.Publish, { author: data.author, entryType: data.entryType }, data.toBlock, maxResults, {});
    for (let event of fetched.results) {
        const tags = event.args.tagsPublished.map((tag) => {
            return web3Api.instance.toUtf8(tag);
        });
        const author = yield resolve.execute({ ethAddress: event.args.author });
        collection.push({
            tags,
            entryType: event.args.entryType.toNumber(),
            entryId: event.args.entryId,
            author
        });
        if (collection.length === maxResults) {
            break;
        }
    }
    return { collection: collection, lastBlock: fetched.fromBlock };
});
export default { execute, name: 'buildFilter' };
//# sourceMappingURL=build-filter.js.map