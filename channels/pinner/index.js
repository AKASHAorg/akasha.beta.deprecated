"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("./runner");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const runner = runner_1.default(sp, getService);
    return { [constants_1.PINNER_MODULE.pin]: runner };
};
const app = {
    init,
    moduleName: constants_1.PINNER_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map