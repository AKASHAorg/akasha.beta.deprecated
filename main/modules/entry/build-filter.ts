import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';
import resolve from '../registry/resolve-ethaddress';

const buildFilter = {
    'id': '/buildFilter',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
    },
    'required': ['toBlock']
};
// @TODO: filter results || implement indexar subs
const execute = Promise.coroutine(
    function* (data: {
        toBlock: number, limit?: number, author?: string, entryType?: number,
        multi: {
            authors: string[],
            entryTypes: number[],
            tags: string[]
        }
    }) {
        const v = new schema.Validator();
        v.validate(data, buildFilter, { throwError: true });

        const collection = [];
        const maxResults = data.limit || 5;
        const fetched = yield contracts.fromEvent(contracts.instance.Entries.Publish,
            { author: data.author, entryType: data.entryType }, data.toBlock, maxResults);
        for (let event of fetched.results) {
            const tags = event.args.tagsPublished.map((tag) => {
                return GethConnector.getInstance().web3.toUtf8(tag);
            });
            const author = yield resolve.execute({ ethAddress: event.args.author });
            collection.push({
                tags,
                entryType: GethConnector.getInstance().web3.toDecimal(event.args.entryType),
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
