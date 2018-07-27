"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logs_1 = require("./logs");
const options_1 = require("./options");
const restart_1 = require("./restart");
const start_1 = require("./start");
const status_1 = require("./status");
const stop_1 = require("./stop");
const sync_status_1 = require("./sync-status");
exports.moduleName = 'geth';
const init = function init(sp, getService) {
    const logs = logs_1.default(sp, getService);
    const options = options_1.default(sp, getService);
    const restart = restart_1.default(sp, getService);
    const start = start_1.default(sp, getService);
    const status = status_1.default(sp, getService);
    const stop = stop_1.default(sp, getService);
    const syncStatus = sync_status_1.default(sp, getService);
    return {
        logs,
        options,
        restart,
        start,
        status,
        stop,
        syncStatus,
    };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map