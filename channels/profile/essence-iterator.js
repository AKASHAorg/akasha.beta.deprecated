"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ethereumjs_util_1 = require("ethereumjs-util");
exports.essenceIteratorSchema = {
    id: '/essenceIterator',
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
        v.validate(data, exports.essenceIteratorSchema, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const address = yield (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress(data);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const toBlock = (!data.lastBlock) ?
            yield web3Api.instance.eth.getBlockNumber() : data.lastBlock;
        const fetched = yield contracts.fromEvent(contracts.instance.Essence.CollectEssence, { receiver: address }, toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            collection.push({
                amount: (web3Api.instance.fromWei(event.args.amount, 'ether')).toFormat(5),
                action: web3Api.instance.toUtf8(ethereumjs_util_1.addHexPrefix(ethereumjs_util_1.unpad(event.args.action))),
                sourceId: event.args.source,
                blockNumber: event.blockNumber,
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
    const essenceIterator = { execute, name: 'essenceIterator' };
    const service = function () {
        return essenceIterator;
    };
    sp().service(constants_1.PROFILE_MODULE.essenceIterator, service);
    return essenceIterator;
}
exports.default = init;
//# sourceMappingURL=essence-iterator.js.map