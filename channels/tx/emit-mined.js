"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.emitMinedSchema = {
    id: '/emitMined',
    type: 'object',
    properties: {
        watch: { type: 'bool' },
    },
    required: ['watch'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.emitMinedSchema, { throwError: true });
        const web3Helper = getService(constants_1.CORE_MODULE.WEB3_HELPER);
        (data.watch) ? web3Helper.startTxWatch() : web3Helper.stopTxWatch();
        return { watching: web3Helper.watching };
    });
    const emitMined = { execute, name: 'emitMined' };
    const service = function () {
        return emitMined;
    };
    sp().service(constants_1.TX_MODULE.emitMined, service);
    return emitMined;
}
exports.default = init;
//# sourceMappingURL=emit-mined.js.map