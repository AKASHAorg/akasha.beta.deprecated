"use strict";
const GethIPC_1 = require('./GethIPC');
const Logger_1 = require('./Logger');
function initModules() {
    const logger = Logger_1.default.getInstance();
    const gethChannel = new GethIPC_1.default();
    return {
        initListeners: (webContents) => {
            gethChannel.initListeners(webContents);
        },
        logger: logger
    };
}
exports.initModules = initModules;
//# sourceMappingURL=exports.js.map