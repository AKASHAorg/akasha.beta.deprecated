"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
const restart_1 = require("./restart");
const start_1 = require("./start");
const status_1 = require("./status");
const stop_1 = require("./stop");
const sync_status_1 = require("./sync-status");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const options = options_1.default(sp, getService);
    const restart = restart_1.default(sp, getService);
    const start = start_1.default(sp, getService);
    const status = status_1.default(sp, getService);
    const stop = stop_1.default(sp, getService);
    const syncStatus = sync_status_1.default(sp, getService);
    return {
        [constants_1.GETH_MODULE.options]: options,
        [constants_1.GETH_MODULE.restartService]: restart,
        [constants_1.GETH_MODULE.startService]: start,
        [constants_1.GETH_MODULE.status]: status,
        [constants_1.GETH_MODULE.stop]: stop,
        [constants_1.GETH_MODULE.syncStatus]: syncStatus,
    };
};
const app = {
    init,
    moduleName: constants_1.GETH_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map