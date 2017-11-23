import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';
import resolve from '../registry/resolve-ethaddress';

export const fetchFromPublish = Promise.coroutine(function* (data: {
    toBlock: number, limit: number,
    lastIndex?: number, args: any, reversed?: boolean
}) {
    const collection = [];
    const fetched = yield contracts
        .fromEvent(contracts.instance.Entries.Publish, data.args, data.toBlock,
            data.limit, { lastIndex: data.lastIndex, reversed: data.reversed || false });
    for (let event of fetched.results) {

        const captureIndex = yield contracts
            .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                data.toBlock, 10, {});

        const tags = captureIndex.results.map(function (ev) {
            return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
        });

        const author = yield resolve.execute({ ethAddress: event.args.author });

        collection.push({
            entryType: captureIndex.results.length ? captureIndex.results[0].args.entryType.toNumber() : -1,
            entryId: event.args.entryId,
            blockNumber: event.blockNumber,
            tags,
            author
        });
        if (collection.length === data.limit) {
            break;
        }
    }

    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});

export const fetchFromTagIndex = Promise.coroutine(function* (data: {
    toBlock: number, limit: number,
    lastIndex?: number, args: any, reversed?: boolean
}) {
    const collection = [];
    const fetched = yield contracts.fromEvent(contracts.instance.Entries.TagIndex,
        data.args, data.toBlock, data.limit, { lastIndex: data.lastIndex, reversed: data.reversed || false });

    for (let event of fetched.results) {
        const fetchedPublish = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { entryId: event.args.entryId },
                data.toBlock, 1, {});

        const captureIndex = yield contracts
            .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                data.toBlock, 10, {});

        const tags = captureIndex.results.map(function (ev) {
            return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
        });

        const author = fetchedPublish.results.length ?
            yield resolve.execute({ ethAddress: fetchedPublish.results[0].args.author }) :
            { ethAddress: null };
        collection.push({
            entryType: event.args.entryType.toNumber(),
            entryId: event.args.entryId,
            blockNumber: event.blockNumber,
            tags,
            author
        });
        if (collection.length === data.limit) {
            break;
        }
    }
    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});
