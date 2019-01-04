"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const followingStreamIteratorS = {
    id: '/followingStreamIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        lastIndex: { type: 'number' },
        reversed: { type: 'boolean' },
    },
    required: ['toBlock'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, followingStreamIteratorS, { throwError: true });
        const address = yield (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress(data);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const fetchedFollow = yield contracts.fromEvent(contracts.instance.Feed.Follow, { follower: address }, 0, 1000, { reversed: true });
        const followList = fetchedFollow.results.map((res) => {
            return res.args.followed;
        });
        const aditionalFilter = function (rawData) {
            return followList.includes(rawData.args.author);
        };
        const collection = [];
        const maxResults = data.limit || 5;
        const fetched = yield contracts
            .fromEventFilter(contracts.instance.Entries.Publish, {}, data.toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false }, aditionalFilter);
        for (const event of fetched.results) {
            const captureIndex = yield contracts
                .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId }, data.toBlock, 10, { stopOnFirst: true });
            const tags = captureIndex.results.map(function (ev) {
                return web3Api.instance.toUtf8(ev.args.tagName);
            });
            const author = yield getService(constants_1.PROFILE_MODULE.getByAddress)
                .execute({ ethAddress: event.args.author });
            collection.push({
                tags,
                author,
                entryType: captureIndex.results.length ?
                    captureIndex.results[0].args.entryType.toNumber() : -1,
                entryId: event.args.entryId,
            });
            if (collection.length === maxResults) {
                break;
            }
        }
        return { collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
    });
    const followingStreamIterator = { execute, name: 'followingStreamIterator' };
    const service = function () {
        return followingStreamIterator;
    };
    sp().service(constants_1.ENTRY_MODULE.followingStreamIterator, service);
    return followingStreamIterator;
}
exports.default = init;
//# sourceMappingURL=following-stream-iterator.js.map