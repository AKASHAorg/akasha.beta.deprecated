"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const cacheKey = 'ENTRY-TAG';
    const calcKey = (id) => `${cacheKey}-${id}`;
    const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
    const mixed = getService(constants_1.CORE_MODULE.STASH).mixed;
    const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
    const fetchFromPublish = Promise.coroutine(function* (data) {
        const collection = [];
        const fetched = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, data.args, data.toBlock, data.limit, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            let tags;
            let author;
            let entryType;
            const key = calcKey(event.args.entryId);
            if (!mixed.hasFull(key)) {
                const captureIndex = yield contracts
                    .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId }, data.toBlock, 10, { stopOnFirst: true });
                tags = captureIndex.results.map(function (ev) {
                    return web3Api.instance.toUtf8(ev.args.tagName);
                });
                author = yield getService(constants_1.PROFILE_MODULE.resolveEthAddress)
                    .execute({ ethAddress: event.args.author });
                entryType = captureIndex.results.length ?
                    captureIndex.results[0].args.entryType.toNumber() : -1;
                mixed.setFull(key, { tags, author, entryType });
            }
            else {
                ({ tags, author, entryType } = mixed.getFull(key));
            }
            collection.push({
                entryType,
                entryId: event.args.entryId,
                blockNumber: event.blockNumber,
                tags,
                author,
            });
            if (collection.length === data.limit) {
                break;
            }
        }
        return { collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
    });
    const fetchFromTagIndex = Promise.coroutine(function* (data) {
        const collection = [];
        const fetched = yield contracts.fromEvent(contracts.instance.Entries.TagIndex, data.args, data.toBlock, data.limit, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            let tags;
            let author;
            let entryType;
            const key = calcKey(event.args.entryId);
            if (!mixed.hasFull(key)) {
                const fetchedPublish = yield contracts
                    .fromEvent(contracts.instance.Entries.Publish, { entryId: event.args.entryId }, data.toBlock, 1, {});
                const captureIndex = yield contracts
                    .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId }, data.toBlock, 10, { stopOnFirst: true });
                tags = captureIndex.results.map(function (ev) {
                    return web3Api.instance.toUtf8(ev.args.tagName);
                });
                author = fetchedPublish.results.length ?
                    yield getService(constants_1.PROFILE_MODULE.resolveEthAddress)
                        .execute({ ethAddress: fetchedPublish.results[0].args.author }) :
                    { ethAddress: null };
                entryType = event.args.entryType.toNumber();
            }
            else {
                ({ tags, author, entryType } = mixed.getFull(key));
            }
            collection.push({
                entryType,
                entryId: event.args.entryId,
                blockNumber: event.blockNumber,
                tags,
                author,
            });
            if (collection.length === data.limit) {
                break;
            }
        }
        return { collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
    });
    const helpers = { fetchFromPublish, fetchFromTagIndex };
    const service = function () {
        return service;
    };
    sp().service(constants_1.ENTRY_MODULE.helpers, service);
    return helpers;
}
exports.default = init;
//# sourceMappingURL=helpers.js.map