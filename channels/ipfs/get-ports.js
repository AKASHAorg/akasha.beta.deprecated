"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const ports = yield (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR))
            .getInstance().getPorts();
        return {
            apiPort: ports.api,
            gatewayPort: ports.gateway,
            swarmPort: ports.swarm,
        };
    });
    const getPorts = { execute, name: 'getPorts' };
    const service = function () {
        return getPorts;
    };
    sp().service(constants_1.IPFS_MODULE.getPorts, service);
    return getPorts;
}
exports.default = init;
//# sourceMappingURL=get-ports.js.map