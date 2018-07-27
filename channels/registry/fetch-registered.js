"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.fetchRegisteredSchema = {
    id: '/fetchRegistered',
    type: 'object',
    properties: {
        toBlock: { type: 'number' },
        limit: { type: 'number' },
    },
    required: ['toBlock'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.fetchRegisteredSchema, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const fetched = yield contracts.fromEvent(contracts.instance.ProfileRegistrar.Register, {}, data.toBlock, maxResults, {});
        for (const event of fetched.results) {
            collection.push({ akashaId: web3Api.instance.toUtf8(event.args.label) });
        }
        return { collection, lastBlock: fetched.fromBlock };
    });
    const fetchRegistered = { execute, name: 'fetchRegistered' };
    const service = function () {
        return fetchRegistered;
    };
    sp().service(constants_1.REGISTRY_MODULE.fetchRegistered, service);
    return fetchRegistered;
}
exports.default = init;
//# sourceMappingURL=fetch-registered.js.map