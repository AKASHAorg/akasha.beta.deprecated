"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.transformEssence = {
    id: '/transformEssence',
    type: 'object',
    properties: {
        amount: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['amount', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.transformEssence, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const bnAmount = web3Api.instance.toWei(data.amount, 'ether');
        const txData = contracts.instance.Essence.transformEssence
            .request(bnAmount, { gas: 100000 });
        const receipt = yield contracts.send(txData, data.token, cb);
        return { receipt };
    });
    const transformEssenceService = { execute, name: 'transformEssence', hasStream: true };
    const service = function () {
        return transformEssenceService;
    };
    sp().service(constants_1.PROFILE_MODULE.transformEssence, service);
    return transformEssenceService;
}
exports.default = init;
//# sourceMappingURL=transform-essence.js.map