"use strict";
const GethIPC_1 = require('./GethIPC');
const IpfsIPC_1 = require('./IpfsIPC');
const Logger_1 = require('./Logger');
function initModules() {
    const logger = Logger_1.default.getInstance();
    const gethChannel = new GethIPC_1.default();
    const ipfsChannel = new IpfsIPC_1.default();
    return {
        initListeners: (webContents) => {
            gethChannel.initListeners(webContents);
            ipfsChannel.initListeners(webContents);
        },
        logger: logger,
        flushAll: () => {
            gethChannel.purgeAllListeners();
            ipfsChannel.purgeAllListeners();
        }
    };
}
exports.initModules = initModules;
//# sourceMappingURL=index.js.map