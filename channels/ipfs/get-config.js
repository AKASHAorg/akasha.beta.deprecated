"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* () {
        const ipfsConnector = getService(constants_1.CORE_MODULE.IPFS_CONNECTOR);
        return {
            apiPort: (ipfsConnector.getInstance().config.config.Addresses.API) ?
                ipfsConnector.getInstance().config.config.Addresses.API.split('/').pop() : '',
            storagePath: ipfsConnector.getInstance().config.repo,
        };
    });
    const getConfig = { execute, name: 'getConfig' };
    const service = function () {
        return getConfig;
    };
    sp().service(constants_1.IPFS_MODULE.getConfig, service);
    return getConfig;
}
exports.default = init;
//# sourceMappingURL=get-config.js.map