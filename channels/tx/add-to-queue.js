"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.addToQueueSchema = {
    id: '/addToQueue',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            tx: { type: 'string' },
        },
        required: ['tx'],
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.addToQueueSchema, { throwError: true });
        data.forEach((hash) => {
            getService(constants_1.CORE_MODULE.WEB3_HELPER).addTxToWatch(hash.tx, false);
        });
        getService(constants_1.CORE_MODULE.WEB3_HELPER).startTxWatch();
        return { watching: getService(constants_1.CORE_MODULE.WEB3_HELPER).watching };
    });
    const addToQueue = { execute, name: 'addToQueue' };
    const service = function () {
        return addToQueue;
    };
    sp().service(constants_1.TX_MODULE.addToQueue, service);
    return addToQueue;
}
exports.default = init;
//# sourceMappingURL=add-to-queue.js.map