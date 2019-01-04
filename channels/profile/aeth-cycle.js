"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.cycleAethSchema = {
    id: '/cycleAeth',
    type: 'object',
    properties: {
        amount: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['amount', 'token'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.cycleAethSchema, { throwError: true });
        const bnAmount = getService(constants_1.CORE_MODULE.WEB3_API)
            .instance.toWei(data.amount, 'ether');
        const txData = getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.AETH.cycleAeth.request(bnAmount, { gas: 160000 });
        const receipt = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .send(txData, data.token, cb);
        return { receipt };
    });
    const cycleAeth = { execute, name: 'cycleAeth', hasStream: true };
    const service = function () {
        return cycleAeth;
    };
    sp().service(constants_1.PROFILE_MODULE.cycleAeth, service);
    return cycleAeth;
}
exports.default = init;
//# sourceMappingURL=aeth-cycle.js.map