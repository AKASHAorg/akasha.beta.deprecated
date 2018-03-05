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
        'limit': { 'type': 'number' },
        'totalLoaded': { 'type': 'number'}
    }
};

/**
 * Get followers of profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {
    lastBlock?: number, limit?: number,
    akashaId?: string, ethAddress?: string, lastIndex?: number, totalLoaded?: number
}) {
    const v = new schema.Validator();
    v.validate(data, followersIterator, { throwError: true });
    let lastFetchedBlock, remainingResults, fromIndex;
    const collection = [];
    const address = yield profileAddress(data);
    const lastBlock = yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const toBlock = (!data.lastBlock) ? lastBlock : data.lastBlock;
    const totalFollowers = yield contracts.instance.Feed.totalFollowers(address);
    // If already loaded all results
    if (totalFollowers <= data.totalLoaded) {
        return {
            collection: collection,
            lastBlock: 0,
            lastIndex: 0,
            akashaId: data.akashaId,
            limit: data.limit
        };
    }

    let maxResults = totalFollowers.toString() === '0' ? 0 : data.limit || 5;
    if (maxResults > totalFollowers.toNumber()) {
        maxResults = totalFollowers.toNumber();
    }
    if (data.totalLoaded) {
        const nextTotal = data.totalLoaded + maxResults;
        if (nextTotal > totalFollowers) {
            maxResults = totalFollowers - data.totalLoaded;
        }
    }
    lastFetchedBlock = toBlock;
    remainingResults = maxResults;
    fromIndex = data.lastIndex;
    while (collection.length < maxResults && lastFetchedBlock !== 0) {
        const fetched = yield contracts.fromEvent(contracts.instance.Feed.Follow, { followed: address },
            lastFetchedBlock, remainingResults, { lastIndex: fromIndex });
        for (let event of fetched.results) {
            const follows = yield contracts.instance.Feed.follows(event.args.follower, address);
            if (!follows) {
                continue;
            }

            collection.push({ ethAddress: event.args.follower });
            if (collection.length === maxResults) {
                break;
            }
        }
        lastFetchedBlock = fetched.fromBlock;
        remainingResults = maxResults - collection.length;
        fromIndex = fetched.lastIndex;
    }

    return {
        collection: uniq(collection),
        lastBlock: lastFetchedBlock,
        lastIndex: fromIndex,
        akashaId: data.akashaId,
        limit: maxResults
    };
});

export default { execute, name: 'followersIterator' };

