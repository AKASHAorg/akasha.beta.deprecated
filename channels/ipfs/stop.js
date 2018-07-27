"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().stop();
        yield Promise.delay(50);
        return { stopped: true };
    });
    const stopService = { execute, name: 'stopService' };
    const service = function () {
        return stopService;
    };
    sp().service(constants_1.IPFS_MODULE.stopService, service);
    return stopService;
}
exports.default = init;
//# sourceMappingURL=stop.js.map