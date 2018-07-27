"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const restartServiceS = {
    id: '/restartService',
    type: 'object',
    properties: {
        timer: { type: 'number' },
    },
    required: ['timer'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, restartServiceS, { throwError: true });
        return getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance().restart(data.timer);
    });
    const restartService = { execute, name: 'restartService' };
    const service = function () {
        return restartService;
    };
    sp().service(constants_1.GETH_MODULE.restartService, service);
    return restartService;
}
exports.default = init;
//# sourceMappingURL=restart.js.map