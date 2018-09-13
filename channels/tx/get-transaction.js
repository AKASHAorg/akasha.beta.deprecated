"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getTransactionSchema = {
    id: '/getTransaction',
    type: 'object',
    properties: {
        transactionHash: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['transactionHash'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.getTransactionSchema, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const requests = data.transactionHash.map((txHash) => {
            return web3Api
                .instance.eth
                .getTransactionReceiptAsync(txHash).then((receipt) => {
                if (receipt) {
                    return Object.assign({}, receipt, { success: receipt.status === '0x1' });
                }
                return web3Api.instance.eth
                    .getTransactionAsync(txHash)
                    .then((txHashData) => {
                    if (txHashData) {
                        return { transactionHash: txHash, blockNumber: null };
                    }
                    return null;
                });
            });
        });
        return Promise.all(requests);
    });
    const getTransaction = { execute, name: 'getTransaction' };
    const service = function () {
        return getTransaction;
    };
    sp().service(constants_1.TX_MODULE.getTransaction, service);
    return getTransaction;
}
exports.default = init;
//# sourceMappingURL=get-transaction.js.map