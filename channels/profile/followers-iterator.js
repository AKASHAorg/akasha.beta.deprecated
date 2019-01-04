"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ramda_1 = require("ramda");
exports.followersIteratorSchema = {
    id: '/followersIterator',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        lastBlock: { type: 'number' },
        limit: { type: 'number' },
        totalLoaded: { type: 'number' },
        lastIndex: { type: 'number' },
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.followersIteratorSchema, { throwError: true });
        let lastFetchedBlock;
        let remainingResults;
        let fromIndex;
        const collection = [];
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const address = yield (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress(data);
        const lastBlock = yield web3Api.instance.eth.getBlockNumber();
        const toBlock = (!data.lastBlock) ? lastBlock : data.lastBlock;
        const totalFollowers = yield contracts.instance.Feed.totalFollowers(address);
        if (totalFollowers <= data.totalLoaded) {
            return {
                collection,
                lastBlock: 0,
                lastIndex: 0,
                akashaId: data.akashaId,
                limit: data.limit,
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
            const fetched = yield contracts.fromEvent(contracts.instance.Feed.Follow, { followed: address }, lastFetchedBlock, remainingResults, { lastIndex: fromIndex });
            for (const event of fetched.results) {
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
            collection: ramda_1.uniq(collection),
            lastBlock: lastFetchedBlock,
            lastIndex: fromIndex,
            akashaId: data.akashaId,
            limit: maxResults,
        };
    });
    const followersIterator = { execute, name: 'followersIterator' };
    const service = function () {
        return followersIterator;
    };
    sp().service(constants_1.PROFILE_MODULE.followersIterator, service);
    return followersIterator;
}
exports.default = init;
//# sourceMappingURL=followers-iterator.js.map