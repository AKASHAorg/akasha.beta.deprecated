import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';
import { uniq } from 'ramda';

export const followersIterator = {
    'id': '/followersIterator',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'lastBlock': { 'type': 'number' },
        'limit': { 'type': 'number' }
    }
};

/**
 * Get followers of profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {
    lastBlock?: number, limit?: number,
    akashaId?: string, ethAddress?: string, lastIndex?: number
}) {
    const v = new schema.Validator();
    v.validate(data, followersIterator, { throwError: true });

    const collection = [];
    const address = yield profileAddress(data);
    const lastBlock = yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const toBlock = (!data.lastBlock) ? lastBlock : data.lastBlock;
    const totalFollowers = yield contracts.instance.Feed.totalFollowers(address);
    let maxResults = totalFollowers.toString() === '0' ? 0 : data.limit || 5;
    if (maxResults > totalFollowers.toNumber()) {
        maxResults = totalFollowers.toNumber();
    }
    const fetched = yield contracts.fromEvent(contracts.instance.Feed.Follow, { followed: address },
        toBlock, maxResults, { lastIndex: data.lastIndex });
    for (let event of fetched.results) {
        const follows = yield contracts.instance.Feed.follows(event.args.follower, address);
        if (!follows) {
            continue;
        }
        const unFollowed = yield contracts.fromEvent(contracts.instance.Feed.UnFollow, {
                followed: address,
                follower: event.args.follower
            },
            lastBlock, 1, { lastIndex: 0 });

        if (unFollowed.results && unFollowed.results.length && unFollowed.results[0].blockNumber > event.blockNumber) {
            continue;
        }

        collection.push({ ethAddress: event.args.follower });
    }

    return {
        collection: uniq(collection),
        lastBlock: fetched.fromBlock,
        lastIndex: fetched.lastIndex,
        akashaId: data.akashaId,
        limit: maxResults
    };
});

export default { execute, name: 'followersIterator' };

