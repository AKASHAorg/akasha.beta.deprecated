"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.tip = {
    id: '/tip',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        token: { type: 'string' },
        value: { type: 'string' },
        tokenAmount: { type: 'string' },
        message: { type: 'string' },
    },
    required: ['token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.tip, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const tokenAmount = web3Api.instance.toWei(data.tokenAmount || 0, 'ether');
        const ethAmount = web3Api.instance.toWei(data.value || 0, 'ether');
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .profileAddress(data);
        const txData = contracts.instance.AETH
            .donate.request(address, tokenAmount, data.message || '', {
            value: ethAmount,
            gas: 200000,
        });
        const transaction = yield contracts.send(txData, data.token, cb);
        return {
            tx: transaction.tx,
            receipt: transaction.receipt,
            receiver: address,
            akashaId: data.akashaId,
        };
    });
    const sendTip = { execute, name: 'tip', hasStream: true };
    const service = function () {
        return sendTip;
    };
    sp().service(constants_1.PROFILE_MODULE.sendTip, service);
    return sendTip;
}
exports.default = init;
//# sourceMappingURL=send-tip.js.map