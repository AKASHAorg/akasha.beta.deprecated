"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        return {};
    });
    const status = { execute, name: 'status' };
    const service = function () {
        return status;
    };
    sp().service(constants_1.IPFS_MODULE.status, service);
    return status;
}
exports.default = init;
//# sourceMappingURL=status.js.map