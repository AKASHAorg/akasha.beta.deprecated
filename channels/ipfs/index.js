"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_image_1 = require("./create-image");
const get_config_1 = require("./get-config");
const get_ports_1 = require("./get-ports");
const logs_1 = require("./logs");
const resolve_1 = require("./resolve");
const set_ports_1 = require("./set-ports");
const start_1 = require("./start");
const status_1 = require("./status");
const stop_1 = require("./stop");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const createImage = create_image_1.default(sp, getService);
    const getConfig = get_config_1.default(sp, getService);
    const getPorts = get_ports_1.default(sp, getService);
    const logs = logs_1.default(sp, getService);
    const resolve = resolve_1.default(sp, getService);
    const setPorts = set_ports_1.default(sp, getService);
    const start = start_1.default(sp, getService);
    const status = status_1.default(sp, getService);
    const stop = stop_1.default(sp, getService);
    return {
        [constants_1.IPFS_MODULE.createImage]: createImage,
        [constants_1.IPFS_MODULE.getConfig]: getConfig,
        [constants_1.IPFS_MODULE.getPorts]: getPorts,
        [constants_1.IPFS_MODULE.logs]: logs,
        [constants_1.IPFS_MODULE.resolve]: resolve,
        [constants_1.IPFS_MODULE.setPorts]: setPorts,
        [constants_1.IPFS_MODULE.startService]: start,
        [constants_1.IPFS_MODULE.status]: status,
        [constants_1.IPFS_MODULE.stopService]: stop,
    };
};
const app = {
    init,
    moduleName: constants_1.IPFS_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map