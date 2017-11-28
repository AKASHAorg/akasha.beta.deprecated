import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';

export const votesIterator = {
    'id': '/votesIterator',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'lastBlock': { 'type': 'number' },
        'lastIndex': {'type': 'number'},
        'limit': { 'type': 'number' },
        'reversed': {'type': 'boolean'}
    },
    'required': ['lastBlock']
};

const execute = Promise.coroutine(function* (data: {
    lastBlock?: number, limit?: number, voteType?: number,
    akashaId?: string, ethAddress?: string, lastIndex?: number, reversed?: boolean
}) {
    const v = new schema.Validator();
    v.validate(data, votesIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const address = yield profileAddress(data);
    const toBlock = (!data.lastBlock) ? yield GethConnector.getInstance().web3.eth.getBlockNumberAsync() : data.lastBlock;
    const fetched = yield contracts.fromEvent(
        contracts.instance.Votes.Vote,
        { voter: address, voteType: data.voteType},
        toBlock,
        maxResults,
        { lastIndex: data.lastIndex, reversed: data.reversed || false }
    );

    for (let event of fetched.results) {
        collection.push({
            voter: event.args.voter,
            target: event.args.target,
            voteType: (event.args.voteType).toString(),
            weight: (event.args.weight).toString(),
            negative: event.args.negative
        });
    }
    return {
        collection: collection,
        lastBlock: fetched.fromBlock,
        lastIndex: fetched.lastIndex,
        akashaId: data.akashaId,
        limit: maxResults
    };
});

export default { execute, name: 'votesIterator' };

