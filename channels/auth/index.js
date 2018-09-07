"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_key_1 = require("./generate-key");
const Auth_1 = require("./Auth");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    Auth_1.default(sp, getService);
    const generateKey = generate_key_1.default(sp, getService);
    return {
        [constants_1.AUTH_MODULE.generateEthKey]: generateKey,
    };
};
const app = {
    init,
    moduleName: constants_1.AUTH_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map