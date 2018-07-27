"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
const contracts_1 = require("./contracts");
const responses_1 = require("./responses");
const services_1 = require("./services");
const stash_1 = require("./stash");
const web3_helper_1 = require("./web3-helper");
const sp_1 = require("./sp");
exports.moduleName = 'core';
const init = async function init() {
    const settings = new Map();
    const getSettings = function () {
        return settings;
    };
    contracts_1.default(sp_1.default, sp_1.getService);
    responses_1.default(sp_1.default, sp_1.getService);
    web3_helper_1.default(sp_1.default, sp_1.getService);
    services_1.default(sp_1.default);
    stash_1.default(sp_1.default);
    sp_1.default().service(constants_1.CORE_MODULE.SETTINGS, getSettings);
    return {};
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map