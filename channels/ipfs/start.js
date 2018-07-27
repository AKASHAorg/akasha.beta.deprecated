"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const ipfsConnector = getService(constants_1.CORE_MODULE.IPFS_CONNECTOR);
        const ipfsProvider = getService(constants_1.CORE_MODULE.IPFS_PROVIDER);
        if (ipfsConnector.getInstance().serviceStatus.process) {
            console.warn('IPFS is already running');
            return { started: true };
        }
        ipfsConnector.getInstance()
            .setIpfsFolder(data.hasOwnProperty('storagePath') ?
            data.storagePath :
            getService(constants_1.CORE_MODULE.SETTINGS).get(constants_1.GENERAL_SETTINGS.IPFS_DEFAULT_PATH));
        yield ipfsConnector.getInstance().start(ramda_1.isEmpty(ipfsProvider.instance) ?
            null : ipfsProvider.instance);
        getService(constants_1.CORE_MODULE.SETTINGS)
            .set(constants_1.GENERAL_SETTINGS.BASE_URL, 'https://gateway.ipfs.io/ipfs/');
        return { started: true };
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(constants_1.IPFS_MODULE.startService, service);
    return startService;
}
exports.default = init;
//# sourceMappingURL=start.js.map