"use strict";
const GethIPC_1 = require('./GethIPC');
const IpfsIPC_1 = require('./IpfsIPC');
const AuthIPC_1 = require('./AuthIPC');
const Logger_1 = require('./Logger');
function initModules() {
    const logger = Logger_1.default.getInstance();
    const gethChannel = new GethIPC_1.default();
    const ipfsChannel = new IpfsIPC_1.default();
    const authChannel = new AuthIPC_1.default();
    return {
        initListeners: (webContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024 });
            gethChannel.initListeners(webContents);
            ipfsChannel.initListeners(webContents);
            authChannel.initListeners(webContents);
        },
        logger: logger,
        flushAll: () => {
            gethChannel.purgeAllListeners();
            ipfsChannel.purgeAllListeners();
            authChannel.purgeAllListeners();
        }
    };
}
exports.initModules = initModules;
//# sourceMappingURL=index.js.map