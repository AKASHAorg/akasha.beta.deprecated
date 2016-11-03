"use strict";
const GethIPC_1 = require('./GethIPC');
const IpfsIPC_1 = require('./IpfsIPC');
const AuthIPC_1 = require('./AuthIPC');
const Logger_1 = require('./Logger');
const TxIPC_1 = require('./TxIPC');
const RegistryIPC_1 = require('./RegistryIPC');
const LicensesIPC_1 = require('./LicensesIPC');
function initModules() {
    const logger = Logger_1.default.getInstance();
    const ipcChannels = [
        new GethIPC_1.default(),
        new IpfsIPC_1.default(),
        new AuthIPC_1.default(),
        new TxIPC_1.default(),
        new RegistryIPC_1.default(),
        new LicensesIPC_1.default()
    ];
    return {
        initListeners: (webContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024 });
            ipcChannels.forEach((obj) => {
                obj.initListeners(webContents);
            });
        },
        logger,
        flushAll: () => {
            ipcChannels.forEach((obj) => {
                obj.purgeAllListeners();
            });
        }
    };
}
exports.initModules = initModules;
//# sourceMappingURL=index.js.map