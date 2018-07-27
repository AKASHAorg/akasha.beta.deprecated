"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("./runner");
exports.moduleName = 'pinner';
const init = function init(sp, getService) {
    const runner = runner_1.default(sp, getService);
    return { runner };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map