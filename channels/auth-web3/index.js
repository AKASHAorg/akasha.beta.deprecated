"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_key_1 = require("./generate-key");
const Auth_1 = require("./Auth");
const regen_session_1 = require("./regen-session");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    Auth_1.default(sp, getService);
    const generateKey = generate_key_1.default(sp, getService);
    const regenSession = regen_session_1.default(sp, getService);
    return {
        [constants_1.AUTH_MODULE.generateEthKey]: generateKey,
        [constants_1.AUTH_MODULE.regenSession]: regenSession,
    };
};
const app = {
    init,
    moduleName: constants_1.AUTH_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map