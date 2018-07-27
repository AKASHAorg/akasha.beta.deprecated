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
exports.moduleName = 'ipfs';
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
        createImage,
        getConfig,
        getPorts,
        logs,
        resolve,
        setPorts,
        start,
        status,
        stop,
    };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map