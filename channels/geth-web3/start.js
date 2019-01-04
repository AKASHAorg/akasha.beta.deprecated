"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const helper = getService(constants_1.CORE_MODULE.WEB3_HELPER);
        const status = yield helper.inSync();
        console.log('status', status);
        yield (getService(constants_1.CORE_MODULE.CONTRACTS)).init();
        return { started: !!status.length };
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(constants_1.GETH_MODULE.startService, service);
    return startService;
}
exports.default = init;
//# sourceMappingURL=start.js.map