"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        if (web3Api.instance) {
            web3Api.instance.reset();
        }
        return { stopped: true };
    });
    const stopService = { execute, name: 'stopService' };
    const service = function () {
        return stopService;
    };
    sp().service(constants_1.GETH_MODULE.stop, service);
    return stopService;
}
exports.default = init;
//# sourceMappingURL=stop.js.map