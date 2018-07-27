"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        return true;
    });
    const generateEthKey = { execute, name: 'generateEthKey' };
    const service = function () {
        return generateEthKey;
    };
    sp().service(constants_1.AUTH_MODULE.generateEthKey, service);
    return generateEthKey;
}
exports.default = init;
//# sourceMappingURL=generate-key.js.map