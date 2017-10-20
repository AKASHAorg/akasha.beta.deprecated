import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const votesIterator = {
    'id': '/tagIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'entryId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' }
    },
    'required': ['toBlock', 'entryId']
};

/**
 * Get individual votes of entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock?: number, limit?: number, entryId: string, lastIndex?: number }) {
    const v = new schema.Validator();
    v.validate(data, votesIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const filter = { target: data.entryId, voteType: 0 };
    const fetched = yield contracts.fromEvent(contracts.instance.Votes.Vote, filter, data.toBlock, maxResults,
        { lastIndex: data.lastIndex });
    for (let event of fetched.results) {
        const weight = (event.args.weight).toString(10);
        collection.push({ ethAddress: event.args.voter, weight: event.args.negative ? '-' + weight : weight });
        if (collection.length === maxResults) {
            break;
        }
    }

    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});

export default { execute, name: 'votesIterator' };

