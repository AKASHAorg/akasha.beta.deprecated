import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import resolve from '../registry/resolve-ethaddress';
import { GethConnector } from '@akashaproject/geth-connector';

const entryTagIterator = {
    'id': '/entryTagIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'tagName': { 'type': 'string' }
    },
    'required': ['toBlock', 'tagName']
};

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number,
    tagName: string, ethAddress?: string, lastIndex?: number }) {
    const v = new schema.Validator();
    v.validate(data, entryTagIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts.fromEvent(contracts.instance.Entries.TagIndex,
        { tagName: data.tagName, author: data.ethAddress }, data.toBlock,
        maxResults, { lastIndex: data.lastIndex });

    for (let event of fetched.results) {
        const fetchedPublish = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { entryId: event.args.entryId },
                data.toBlock, 1, {});

        const captureIndex = yield contracts
            .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                data.toBlock, 10, {});

        const tags = captureIndex.results.map(function (ev) {
            return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
        });

        const author = yield resolve.execute({ ethAddress: fetchedPublish.results[0].args.author });

        collection.push({
            entryType: GethConnector.getInstance().web3.toDecimal(event.args.entryType),
            entryId: event.args.entryId,
            tags,
            author
        });
        if (collection.length === maxResults) {
            break;
        }
    }
    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});

export default { execute, name: 'entryTagIterator' };

