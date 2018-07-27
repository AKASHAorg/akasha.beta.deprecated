"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("./constants");
const loginS = {
    id: '/loginWeb',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        rememberTime: { type: 'number' },
    },
    required: ['ethAddress'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, loginS, { throwError: true });
        return getService(constants_1.AUTH_MODULE.auth).login(data.ethAddress, data.rememberTime);
    });
    const login = { execute, name: 'login' };
    const service = function () {
        return login;
    };
    sp().service(constants_1.AUTH_MODULE.login, service);
    return login;
}
exports.default = init;
//# sourceMappingURL=login.js.map