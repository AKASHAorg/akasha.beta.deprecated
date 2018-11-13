import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, ENTRY_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
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
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, followingStreamIteratorS, { throwError: true });
        const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const web3Api = getService(CORE_MODULE.WEB3_API);
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
            const author = yield getService(PROFILE_MODULE.getByAddress)
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
    sp().service(ENTRY_MODULE.followingStreamIterator, service);
    return followingStreamIterator;
}
//# sourceMappingURL=following-stream-iterator.js.map