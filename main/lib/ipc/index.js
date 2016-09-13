"use strict";
const GethIPC_1 = require('./GethIPC');
const IpfsIPC_1 = require('./IpfsIPC');
const AuthIPC_1 = require('./AuthIPC');
const Logger_1 = require('./Logger');
const TxIPC_1 = require('./TxIPC');
const RegistryIPC_1 = require('./RegistryIPC');
function initModules() {
    const logger = Logger_1.default.getInstance();
    const gethChannel = new GethIPC_1.default();
    const ipfsChannel = new IpfsIPC_1.default();
    const authChannel = new AuthIPC_1.default();
    const txChannel = new TxIPC_1.default();
    const registryChannel = new RegistryIPC_1.default();
    return {
        initListeners: (webContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024 });
            gethChannel.initListeners(webContents);
            ipfsChannel.initListeners(webContents);
            authChannel.initListeners(webContents);
            txChannel.initListeners(webContents);
            registryChannel.initListeners(webContents);
        },
        logger: logger,
        flushAll: () => {
            gethChannel.purgeAllListeners();
            ipfsChannel.purgeAllListeners();
            authChannel.purgeAllListeners();
            txChannel.purgeAllListeners();
            registryChannel.purgeAllListeners();
        }
    };
}
exports.initModules = initModules;
//# sourceMappingURL=index.js.map