import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { mixed } from '../models/records';
import { BLOCK_INTERVAL, A_STREAM_I } from '../../config/settings';
import { GethConnector } from '@akashaproject/geth-connector';
import getEntry from './get-entry';


const fetch = Promise.coroutine(function*(entries, toBlock, limit) {
    const fromBlock = toBlock - BLOCK_INTERVAL;
    const filter = { fromBlock: (fromBlock > 0) ? fromBlock : 0, toBlock: toBlock };
    const events = yield contracts.instance.entries.getPublished(filter);
    let lastBlock;
    for (let i = 0; i < events.length; i++) {
        entries.add(events[i].args.entryId.toString());
        if (entries.size === limit) {
            lastBlock = events[i].blockNumber;
            break;
        }
    }
    return lastBlock;
});

const execute = Promise.coroutine(function*(data: { limit?: number, toBlock?: number }) {
    let toBlock = (data.toBlock) ? data.toBlock :
        yield GethConnector.getInstance()
            .web3
            .eth
            .getBlockNumberAsync();
    const indexBlock = toBlock;

    const limit = (data.limit) ? data.limit : 5;
    let lastBlock, entries, cache;
    if (mixed.hasFull(`${A_STREAM_I}${data.toBlock}`)) {
        cache = mixed.getFull(`${A_STREAM_I}${data.toBlock}`);
        entries = cache.entries;
        lastBlock = cache.lastBlock;
    } else {
        entries = new Set();
        while (entries.size < limit && toBlock > 0) {
            lastBlock = yield fetch(entries, toBlock, limit);
            toBlock -= BLOCK_INTERVAL;
        }
        mixed.setFull(`${A_STREAM_I}${indexBlock}`, { entries, lastBlock });
    }

    const collection = yield Promise.all(Array.from(entries).map((entryId) => getEntry.execute({ entryId })));
    return { collection, toBlock: data.toBlock, lastBlock: lastBlock };
});

export default { execute, name: 'allStreamIterator' };
