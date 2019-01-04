"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const followers_iterator_1 = require("./followers-iterator");
const ramda_1 = require("ramda");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, followers_iterator_1.followersIteratorSchema, { throwError: true });
        let lastFetchedBlock;
        let remainingResults;
        let fromIndex;
        const collection = [];
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const address = yield (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress(data);
        const lastBlock = yield web3Api.instance.eth.getBlockNumber();
        const toBlock = (!data.lastBlock) ? lastBlock : data.lastBlock;
        const totalFollowing = yield contracts.instance.Feed.totalFollowing(address);
        if (totalFollowing <= data.totalLoaded) {
            return {
                collection,
                lastBlock: 0,
                lastIndex: 0,
                akashaId: data.akashaId,
                limit: data.limit,
            };
        }
        let maxResults = totalFollowing.toString() === '0' ? 0 : data.limit || 5;
        if (maxResults > totalFollowing.toNumber()) {
            maxResults = totalFollowing.toNumber();
        }
        if (data.totalLoaded) {
            const nextTotal = data.totalLoaded + maxResults;
            if (nextTotal > totalFollowing) {
                maxResults = totalFollowing - data.totalLoaded;
            }
        }
        lastFetchedBlock = toBlock;
        remainingResults = maxResults;
        fromIndex = data.lastIndex;
        while (collection.length < maxResults && lastFetchedBlock !== 0) {
            const fetched = yield contracts.fromEvent(contracts.instance.Feed.Follow, { follower: address }, lastFetchedBlock, remainingResults, { lastIndex: fromIndex });
            for (const event of fetched.results) {
                const follows = yield contracts.instance.Feed.follows(address, event.args.followed);
                if (!follows) {
                    continue;
                }
                collection.push({ ethAddress: event.args.followed });
                if (collection.length === maxResults) {
                    break;
                }
            }
            lastFetchedBlock = fetched.fromBlock;
            remainingResults = maxResults - collection.length;
            fromIndex = fetched.lastIndex;
        }
        return {
            collection: ramda_1.uniq(collection),
            lastBlock: lastFetchedBlock,
            lastIndex: fromIndex,
            akashaId: data.akashaId,
            limit: maxResults,
        };
    });
    const followingIterator = { execute, name: 'followingIterator' };
    const service = function () {
        return followingIterator;
    };
    sp().service(constants_1.PROFILE_MODULE.followingIterator, service);
    return followingIterator;
}
exports.default = init;
//# sourceMappingURL=following-iterator.js.map