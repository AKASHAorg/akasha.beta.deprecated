"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.transfersIteratorSchema = {
    id: '/transfersIterator',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        limit: { type: 'number' },
        toBlock: { type: 'number' },
        lastIndex: { type: 'number' },
        reversed: { type: 'boolean' },
        token: { type: 'string' },
    },
    required: ['toBlock', 'ethAddress'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.transfersIteratorSchema, { throwError: true });
        const maxResults = data.limit || 5;
        const collection = [];
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const profileHelpers = getService(constants_1.COMMON_MODULE.profileHelpers);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const fetched = yield contracts
            .fromEvent(contracts.instance.AETH.Transfer, { to: data.ethAddress }, data.toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            const from = yield profileHelpers.resolveEthAddress(event.args.from);
            collection.push({
                from,
                amount: (web3Api.instance.fromWei(event.args.value, 'ether')).toFormat(5),
                blockNumber: event.blockNumber,
            });
            if (collection.length === data.limit) {
                break;
            }
        }
        return { collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
    });
    const transfersIterator = { execute, name: 'transfersIterator' };
    const service = function () {
        return transfersIterator;
    };
    sp().service(constants_1.PROFILE_MODULE.transfersIterator, service);
    return transfersIterator;
}
exports.default = init;
//# sourceMappingURL=aeth-transfers-iterator.js.map