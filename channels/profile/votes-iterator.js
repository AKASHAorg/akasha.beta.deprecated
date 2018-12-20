"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.votesIterator = {
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
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.votesIterator, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const address = yield (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress(data);
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
    sp().service(constants_1.PROFILE_MODULE.votesIterator, service);
    return votesIteratorService;
}
exports.default = init;
//# sourceMappingURL=votes-iterator.js.map