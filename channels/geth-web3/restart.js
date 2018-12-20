"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        yield (getService(constants_1.GETH_MODULE.stop)).execute();
        yield Promise.delay(500);
        return (getService(constants_1.GETH_MODULE.startService)).execute();
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