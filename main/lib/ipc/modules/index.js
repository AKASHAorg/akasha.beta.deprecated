"use strict";
const index_1 = require('./auth/index');
const index_2 = require('./profile/index');
function initModules() {
    if (!index_1.module.auth) {
        index_1.module.init();
    }
}
exports.initModules = initModules;
function initIpfsModules() {
    if (!index_2.module.helpers) {
        index_2.module.init();
    }
}
exports.initIpfsModules = initIpfsModules;
//# sourceMappingURL=index.js.map