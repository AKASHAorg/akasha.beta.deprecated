import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';

/**
 * Get followers of profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { lastBlock?: number, limit?: number, akashaId?: string, ethAddress?: string }) {
    const collection = [];
    const maxResults = data.limit || 5;
    const address = yield profileAddress(data);
    const toBlock = (!data.lastBlock) ? yield GethConnector.getInstance().web3.eth.getBlockNumberAsync() : data.lastBlock;
    const fetched = yield contracts.fromEvent(contracts.instance.Feed.Follow, { followed: address }, toBlock, maxResults);
    for (let event of fetched.results) {
        collection.push({ethAddress: event.args.follower});
    }
    return { collection: collection, lastBlock: fetched.fromBlock, akashaId: data.akashaId, limit: maxResults };
});

export default { execute, name: 'followersIterator' };

