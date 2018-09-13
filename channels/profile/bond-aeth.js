"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.bondAethSchema = {
    id: '/bondAeth',
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
        v.validate(data, exports.bondAethSchema, { throwError: true });
        const bnAmount = getService(constants_1.CORE_MODULE.WEB3_API)
            .instance.toWei(data.amount, 'ether');
        const txData = getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.AETH.bondAeth.request(bnAmount, { gas: 100000 });
        const transaction = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const bondAeth = { execute, name: 'bondAeth', hasStream: true };
    const service = function () {
        return bondAeth;
    };
    sp().service(constants_1.PROFILE_MODULE.bondAeth, service);
    return bondAeth;
}
exports.default = init;
//# sourceMappingURL=bond-aeth.js.map