"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const state = yield (getService(constants_1.CORE_MODULE.WEB3_HELPER)).inSync();
        if (!state.length) {
            return { synced: true };
        }
        if (state.length === 2) {
            return Object.assign({ synced: false, peerCount: state[0] }, state[1]);
        }
        return { synced: false, peerCount: state[0] };
    });
    const syncStatus = { execute, name: 'syncStatus' };
    const service = function () {
        return syncStatus;
    };
    sp().service(constants_1.GETH_MODULE.syncStatus, service);
    return syncStatus;
}
exports.default = init;
//# sourceMappingURL=sync-status.js.map