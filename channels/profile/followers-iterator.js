import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { uniq } from 'ramda';
export const followersIteratorSchema = {
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
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, followersIteratorSchema, { throwError: true });
        let lastFetchedBlock;
        let remainingResults;
        let fromIndex;
        const collection = [];
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
        const lastBlock = yield web3Api.instance.eth.getBlockNumberAsync();
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
            collection: uniq(collection),
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
    sp().service(PROFILE_MODULE.followersIterator, service);
    return followersIterator;
}
//# sourceMappingURL=followers-iterator.js.map