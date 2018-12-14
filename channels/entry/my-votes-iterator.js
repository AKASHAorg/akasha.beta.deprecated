import * as Promise from 'bluebird';
import { descend, head, last, prop, sortWith, take } from 'ramda';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
const myVotesIteratorS = {
    id: '/myVotesIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
        lastIndex: { type: 'number' },
        ethAddress: { type: 'string', format: 'address' },
        reversed: { type: 'boolean' },
        totalLoaded: { type: 'number' },
    },
    required: ['toBlock'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        v.validate(data, myVotesIteratorS, { throwError: true });
        const etherBase = (data.ethAddress) ? data.ethAddress : web3Api.instance.eth.defaultAccount;
        const collection = [];
        const record = yield contracts.instance.Votes.totalVotesOf(etherBase);
        let maxResults = record[1].toString() === '0' ? 0 : data.limit || 5;
        if (maxResults > record[1].toNumber()) {
            maxResults = record[1].toNumber();
        }
        if (record[0].toNumber() <= data.totalLoaded) {
            return { collection: [], lastBlock: 0 };
        }
        if (data.totalLoaded) {
            const nextTotal = data.totalLoaded + maxResults;
            if (nextTotal > record[1].toNumber()) {
                maxResults = record[1].toNumber() - data.totalLoaded;
            }
        }
        const filter = { voter: etherBase, voteType: 0 };
        const fetched = yield contracts
            .fromEvent(contracts.instance.Votes.Vote, filter, data.toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            const weight = (event.args.weight).toString(10);
            collection.push({
                weight: event.args.negative ? '-' + weight : weight,
                entryId: event.args.target,
                logIndex: event.logIndex,
                blockNumber: event.blockNumber,
                isVote: true,
            });
            if (collection.length === maxResults) {
                break;
            }
        }
        const entryCount = yield contracts.instance.Entries.getEntryCount(etherBase);
        let entryMaxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
        if (entryMaxResults > entryCount.toNumber()) {
            entryMaxResults = entryCount.toNumber();
        }
        const fetchedEntries = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { author: etherBase }, data.toBlock, entryMaxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetchedEntries.results) {
            collection.push({
                entryId: event.args.entryId,
                blockNumber: event.blockNumber,
                logIndex: event.logIndex,
                isVote: false,
            });
        }
        const sortedResults = take(data.limit || 5, sortWith([descend(prop('blockNumber')),
            descend(prop('logIndex'))], collection));
        const lastLog = data.reversed ? head(sortedResults) : last(sortedResults);
        const [lastIndex, lastBlock] = lastLog ? [lastLog.logIndex, lastLog.blockNumber] : [0, 0];
        return { lastBlock, lastIndex, collection: sortedResults };
    });
    const myVotesIterator = { execute, name: 'myVotesIterator' };
    const service = function () {
        return myVotesIterator;
    };
    sp().service(ENTRY_MODULE.myVotesIterator, service);
    return myVotesIterator;
}
//# sourceMappingURL=my-votes-iterator.js.map