"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        return Promise.fromCallback((cb) => {
            return getService(constants_1.CORE_MODULE.GETH_CONNECTOR)
                .getInstance().logger.query({ start: 0, limit: 20, order: 'desc' }, cb);
        });
    });
    const logs = { execute, name: 'logs' };
    const service = function () {
        return logs;
    };
    sp().service(constants_1.GETH_MODULE.logs, service);
    return logs;
}
exports.default = init;
//# sourceMappingURL=logs.js.map