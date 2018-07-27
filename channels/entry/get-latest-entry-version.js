"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const entryEth = yield getService(constants_1.ENTRY_MODULE.getEntryIpfsHash).execute(data);
        const entryIpfs = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)
            .getInstance().api.get(entryEth.ipfsHash);
        const version = entryIpfs.version || null;
        return { version };
    });
    const getLatestEntryVersion = { execute, name: 'getLatestEntryVersion' };
    const service = function () {
        return getLatestEntryVersion;
    };
    sp().service(constants_1.ENTRY_MODULE.getLatestEntryVersion, service);
    return getLatestEntryVersion;
}
exports.default = init;
//# sourceMappingURL=get-latest-entry-version.js.map