"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        return (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR))
            .getInstance().setPorts(data.ports, data.restart);
    });
    const setPorts = { execute, name: 'setPorts' };
    const service = function () {
        return setPorts;
    };
    sp().service(constants_1.IPFS_MODULE.setPorts, service);
    return setPorts;
}
exports.default = init;
//# sourceMappingURL=set-ports.js.map