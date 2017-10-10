import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';
import resolve from '../registry/resolve-ethaddress';

const allStreamIterator = {
    'id': '/allStreamIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
    },
    'required': ['toBlock']
};

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number, lastIndex?: number }) {
    const v = new schema.Validator();
    v.validate(data, allStreamIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts
        .fromEvent(contracts.instance.Entries.Publish, {}, data.toBlock,
            maxResults, { lastIndex: data.lastIndex });
    for (let event of fetched.results) {

        const captureIndex = yield contracts
            .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                data.toBlock, 10, {});

        const tags = captureIndex.results.map(function (ev) {
            return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
        });

        const author = yield resolve.execute({ ethAddress: event.args.author });

        collection.push({
            entryType: GethConnector.getInstance().web3.toDecimal(captureIndex.results[0].args.entryType),
            entryId: event.args.entryId,
            tags,
            author
        });
        if (collection.length === maxResults) {
            break;
        }
    }
    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex};
});

export default { execute, name: 'allStreamIterator' };
