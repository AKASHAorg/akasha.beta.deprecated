"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bottle = require("bottlejs");
const constants_1 = require("@akashaproject/common/constants");
Bottle.config['strict'] = true;
const akashaSp = new Bottle();
const getSp = function () {
    return akashaSp;
};
exports.getService = function (name) {
    return akashaSp.container[name];
};
exports.getCoreServices = function () {
    return {
        [constants_1.CORE_MODULE.WEB3_HELPER]: exports.getService(constants_1.CORE_MODULE.WEB3_HELPER),
        [constants_1.CORE_MODULE.SETTINGS]: exports.getService(constants_1.CORE_MODULE.SETTINGS),
        [constants_1.CORE_MODULE.CONTRACTS]: exports.getService(constants_1.CORE_MODULE.CONTRACTS),
        [constants_1.CORE_MODULE.WEB3_API]: exports.getService(constants_1.CORE_MODULE.WEB3_API),
        [constants_1.CORE_MODULE.STASH]: exports.getService(constants_1.CORE_MODULE.STASH),
    };
};
exports.default = getSp;
//# sourceMappingURL=sp.js.map