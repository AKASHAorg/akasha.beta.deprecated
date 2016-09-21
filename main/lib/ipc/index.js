"use strict";
const GethIPC_1 = require('./GethIPC');
const IpfsIPC_1 = require('./IpfsIPC');
const AuthIPC_1 = require('./AuthIPC');
const Logger_1 = require('./Logger');
const TxIPC_1 = require('./TxIPC');
const RegistryIPC_1 = require('./RegistryIPC');
const ProfileIPC_1 = require('./ProfileIPC');
const TagsIPC_1 = require('./TagsIPC');
const EntryIPC_1 = require('./EntryIPC');
const CommentsIPC_1 = require('./CommentsIPC');
function initModules() {
    const logger = Logger_1.default.getInstance();
    const ipcChannels = [
        new GethIPC_1.default(),
        new IpfsIPC_1.default(),
        new AuthIPC_1.default(),
        new TxIPC_1.default(),
        new RegistryIPC_1.default(),
        new ProfileIPC_1.default(),
        new TagsIPC_1.default(),
        new EntryIPC_1.default(),
        new CommentsIPC_1.default()
    ];
    return {
        initListeners: (webContents) => {
            logger.registerLogger('akasha', { maxsize: 50 * 1024 });
            ipcChannels.forEach((obj) => {
                obj.initListeners(webContents);
            });
        },
        logger: logger,
        flushAll: () => {
            ipcChannels.forEach((obj) => {
                obj.purgeAllListeners();
            });
        }
    };
}
exports.initModules = initModules;
//# sourceMappingURL=index.js.map