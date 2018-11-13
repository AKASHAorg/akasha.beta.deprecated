import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import resolve from '../registry/resolve-ethaddress';

const votesIterator = {
    'id': '/votesIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'lastIndex': {'type': 'number'},
        'entryId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'reversed': { 'type': 'boolean' },
        'totalLoaded': { 'type': 'number' }
    },
    'required': ['toBlock']
};

/**
 * Get individual votes of entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {
    toBlock?: number, limit?: number,
    entryId?: string, commentId?: string, lastIndex?: number, reversed?: boolean,
    totalLoaded?: number
}) {

    const v = new schema.Validator();
    v.validate(data, votesIterator, { throwError: true });
    const collection = [];
    const sourceId = data.entryId || data.commentId;
    const record = yield contracts.instance.Votes.getRecord(sourceId);
    let maxResults = record[0].toString() === '0' ? 0 : data.limit || 5;
    if (maxResults > record[0].toNumber()) {
        maxResults = record[0].toNumber();
    }
    if (record[0].toNumber() <= data.totalLoaded) {
        return { collection: [], lastBlock: 0 };
    }
    if (data.totalLoaded) {
        const nextTotal = data.totalLoaded + maxResults;
        if (nextTotal > record[0].toNumber()) {
            maxResults = record[0].toNumber() - data.totalLoaded;
        }
    }
    const filter = { target: data.entryId || data.commentId, voteType: data.entryId ? 0 : 1 };
    const fetched = yield contracts.fromEvent(contracts.instance.Votes.Vote, filter, data.toBlock, maxResults,
        { lastIndex: data.lastIndex, reversed: data.reversed || false });
    for (let event of fetched.results) {
        const weight = (event.args.weight).toString(10);
        const author = yield resolve.execute({ ethAddress: event.args.voter });

        collection.push(Object.assign({ weight: event.args.negative ? '-' + weight : weight }, author));
        if (collection.length === maxResults) {
            break;
        }
    }

    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});


export default { execute, name: 'votesIterator' };

