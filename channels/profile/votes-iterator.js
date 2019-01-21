import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
export const votesIterator = {
    id: '/votesIterator',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        lastBlock: { type: 'number' },
        lastIndex: { type: 'number' },
        limit: { type: 'number' },
        reversed: { type: 'boolean' },
    },
    required: ['lastBlock'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, votesIterator, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
        const toBlock = (!data.lastBlock) ?
            yield web3Api.instance.eth.getBlockNumber() : data.lastBlock;
        const fetched = yield contracts.fromEvent(contracts.instance.Votes.Vote, { voter: address, voteType: data.voteType }, toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            collection.push({
                voter: event.args.voter,
                target: event.args.target,
                voteType: (event.args.voteType).toString(),
                weight: (event.args.weight).toString(),
                negative: event.args.negative,
            });
        }
        return {
            collection,
            lastBlock: fetched.fromBlock,
            lastIndex: fetched.lastIndex,
            akashaId: data.akashaId,
            limit: maxResults,
        };
    });
    const votesIteratorService = { execute, name: 'votesIterator' };
    const service = function () {
        return votesIteratorService;
    };
    sp().service(PROFILE_MODULE.votesIterator, service);
    return votesIteratorService;
}
//# sourceMappingURL=votes-iterator.js.map