"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        throw new Error('Filtering logs is deprecated');
    });
    const logs = { execute, name: 'logs' };
    const service = function () {
        return logs;
    };
    sp().service(constants_1.IPFS_MODULE.logs, service);
    return logs;
}
exports.default = init;
//# sourceMappingURL=logs.js.map