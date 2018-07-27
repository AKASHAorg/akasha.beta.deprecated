"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const session = getService(constants_1.AUTH_MODULE.auth).regenSession(data.token);
        return { session };
    });
    const regenSession = { execute, name: 'regenSession' };
    const service = function () {
        return regenSession;
    };
    sp().service(constants_1.AUTH_MODULE.regenSession, service);
    return regenSession;
}
exports.default = init;
//# sourceMappingURL=regen-session.js.map