"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.freeAethSchema = {
    id: '/freeAeth',
    type: 'object',
    properties: {
        token: { type: 'string' },
    },
    required: ['token'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.freeAethSchema, { throwError: true });
        const txData = getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.AETH.freeAeth.request({ gas: 1000000 });
        const transaction = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const freeAeth = { execute, name: 'freeAeth', hasStream: true };
    const service = function () {
        return freeAeth;
    };
    sp().service(constants_1.PROFILE_MODULE.freeAeth, service);
    return freeAeth;
}
exports.default = init;
//# sourceMappingURL=aeth-free.js.map