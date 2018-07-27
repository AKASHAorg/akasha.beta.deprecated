import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';
import resolve from '../registry/resolve-ethaddress';
import { mixed } from '../models/records';
import { isNil } from 'ramda';

const cacheKey = 'ENTRY-TAG';
const calcKey = (id) => `${cacheKey}-${id}`;

export const fetchFromPublish = Promise.coroutine(function* (data: {
    toBlock: number, limit: number,
    lastIndex?: number, args: any, reversed?: boolean, entryType?: number
}) {
    const collection = [];
    const fetched = yield contracts
        .fromEvent(contracts.instance.Entries.Publish, data.args, data.toBlock,
            data.limit, { lastIndex: data.lastIndex, reversed: data.reversed || false });
    for (let event of fetched.results) {
        let tags, author, entryType;
        const key = calcKey(event.args.entryId);
        if (!mixed.hasFull(key)) {
            const captureIndex = yield contracts
                .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                    data.toBlock, 10, { stopOnFirst: true });

            tags = captureIndex.results.map(function (ev) {
                return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
            });

            author = yield resolve.execute({ ethAddress: event.args.author });
            entryType = captureIndex.results.length ? captureIndex.results[0].args.entryType.toNumber() : -1;
            mixed.setFull(key, { tags: tags, author: author, entryType: entryType });
        } else {
            ({ tags, author, entryType } = mixed.getFull(key));
        }
        if (!isNil(data.entryType) && entryType !== data.entryType) continue;
        collection.push({
            entryType: entryType,
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
    lastIndex?: number, args: any, reversed?: boolean, entryType?: number
}) {
    const collection = [];
    const fetched = yield contracts.fromEvent(contracts.instance.Entries.TagIndex,
        data.args, data.toBlock, data.limit, { lastIndex: data.lastIndex, reversed: data.reversed || false });

    for (let event of fetched.results) {
        let tags, author, entryType;
        const key = calcKey(event.args.entryId);
        if (!mixed.hasFull(key)) {
            const fetchedPublish = yield contracts
                .fromEvent(contracts.instance.Entries.Publish, { entryId: event.args.entryId },
                    data.toBlock, 1, {});

            const captureIndex = yield contracts
                .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                    data.toBlock, 10, { stopOnFirst: true });

            tags = captureIndex.results.map(function (ev) {
                return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
            });

            author = fetchedPublish.results.length ?
                yield resolve.execute({ ethAddress: fetchedPublish.results[0].args.author }) :
                { ethAddress: null };
            entryType = event.args.entryType.toNumber();
        } else {
            ({ tags, author, entryType } = mixed.getFull(key));
        }
        if (!isNil(data.entryType) && entryType !== data.entryType) continue;
        collection.push({
            entryType: entryType,
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
