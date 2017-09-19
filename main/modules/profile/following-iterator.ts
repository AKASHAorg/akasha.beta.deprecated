import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';

/**
 * Get followed profiles of id
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { lastBlock?: number, limit?: number, akashaId?: string, ethAddress?: string }) {
    const collection = [];
    const maxResults = data.limit || 5;
    const address = yield profileAddress(data);
    const toBlock = (!data.lastBlock) ? yield GethConnector.getInstance().web3.eth.getBlockNumberAsync() : data.lastBlock;
    const fetched = yield contracts.fromEvent(contracts.instance.Feed.Follow, { follower: address }, toBlock, maxResults);
    for (let event of fetched.results) {
        console.log(event);
        collection.push({ ethAddress: event.args.followed });
    }
    return { collection: collection, lastBlock: fetched.fromBlock, akashaId: data.akashaId, limit: maxResults };
});

export default { execute, name: 'followingIterator' };

