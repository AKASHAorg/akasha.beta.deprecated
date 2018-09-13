"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.transfer = {
    id: '/transfer',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        token: { type: 'string' },
        value: { type: 'string' },
        tokenAmount: { type: 'string' },
    },
    required: ['token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.transfer, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        if (data.tokenAmount && data.value) {
            throw new Error('Can only send eth or aeth token individually, not combined');
        }
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .profileAddress(data);
        const tokenAmount = web3Api.instance.toWei(data.tokenAmount || 0, 'ether');
        const ethAmount = web3Api.instance.toWei(data.value || 0, 'ether');
        let txData;
        if (data.tokenAmount) {
            txData = contracts.instance.AETH
                .transfer.request(address, tokenAmount, { gas: 200000 });
        }
        else if (data.value) {
            txData = web3Api.instance.eth
                .sendTransaction.request({ to: address, value: ethAmount, gas: 50000 });
        }
        const transaction = yield contracts.send(txData, data.token, cb);
        return {
            tx: transaction.tx,
            receipt: transaction.receipt,
            receiver: address,
            akashaId: data.akashaId,
        };
    });
    const transferService = { execute, name: 'transfer', hasStream: true };
    const service = function () {
        return transferService;
    };
    sp().service(constants_1.PROFILE_MODULE.transfer, service);
    return transferService;
}
exports.default = init;
//# sourceMappingURL=transfer.js.map