"use strict";
const index_1 = require('./auth/index');
const index_2 = require('./profile/index');
function initModules() {
    index_1.module.init();
}
exports.initModules = initModules;
function initIpfsModules() {
    index_2.module.init();
}
exports.initIpfsModules = initIpfsModules;
//# sourceMappingURL=index.js.map