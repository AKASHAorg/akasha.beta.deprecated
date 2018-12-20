"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        return (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)).getInstance().api.get(data.hash);
    });
    const resolve = { execute, name: 'resolve' };
    const service = function () {
        return resolve;
    };
    sp().service(constants_1.IPFS_MODULE.resolve, service);
    return resolve;
}
exports.default = init;
//# sourceMappingURL=resolve.js.map