import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getFollowingList from '../profile/following-list';
import currentProfile from '../registry/current-profile';
import { mixed } from '../models/records';
import { FOLLOWING_LIST, BLOCK_INTERVAL, F_STREAM_I } from '../../config/settings';
import { GethConnector } from '@akashaproject/geth-connector';
import getEntry from './get-entry';


const fetch = Promise.coroutine(function*(entries, following, toBlock, limit) {
    const fromBlock = toBlock - BLOCK_INTERVAL;
    const filter = { fromBlock: (fromBlock > 0) ? fromBlock : 0, toBlock: toBlock };
    const events = yield contracts.instance.entries.getPublished(filter);
    let lastBlock;
    for (let i = 0; i < events.length; i++) {
        if (following.indexOf(events[i].args.author) !== -1) {
            entries.add(events[i].args.entryId.toString());
            if (entries.size === limit) {
                lastBlock = events[i].blockNumber;
                break;
            }
        }
    }
    return lastBlock;
});

const execute = Promise.coroutine(function*(data: { limit?: number, toBlock?: number, purgeCache?: boolean }) {
    if (data.purgeCache) {
        mixed.removeFull(FOLLOWING_LIST);
    }
    if (!mixed.hasFull(FOLLOWING_LIST)) {
        const myProfile = yield currentProfile.execute();
        const following = yield getFollowingList.execute({ akashaId: myProfile.akashaId });
        mixed.setFull(FOLLOWING_LIST, following.collection);
    }
    let toBlock = (data.toBlock) ? data.toBlock :
        yield GethConnector.getInstance()
            .web3
            .eth
            .getBlockNumberAsync();
    const indexBlock = toBlock;
    const following = mixed.getFull(FOLLOWING_LIST);

    const limit = (data.limit) ? data.limit : 5;
    let lastBlock, entries, cache;
    if (mixed.hasFull(`${F_STREAM_I}${data.toBlock}`)) {
        cache = mixed.getFull(`${F_STREAM_I}${data.toBlock}`);
        entries = cache.entries;
        lastBlock = cache.lastBlock;
    } else {
        entries = new Set();
        while (entries.size < limit && toBlock > 0) {
            lastBlock = yield fetch(entries, following, toBlock, limit);
            toBlock -= BLOCK_INTERVAL;
        }
        mixed.setFull(`${F_STREAM_I}${indexBlock}`, { entries, lastBlock });
    }

    const collection = yield Promise.all(Array.from(entries).map((entryId) => getEntry.execute({ entryId })));
    return { collection, toBlock: data.toBlock, lastBlock: lastBlock };
});

export default { execute, name: 'followingStreamIterator' };
