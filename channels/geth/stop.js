"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        yield getService(constants_1.CORE_MODULE.CONTRACTS).stopAllWatchers();
        yield getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance().stop();
        getService(constants_1.CORE_MODULE.CONTRACTS).reset();
        return {};
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