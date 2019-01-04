"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const safe_buffer_1 = require("safe-buffer");
const constants_1 = require("@akashaproject/common/constants");
const generateEthKeyS = {
    id: '/generateEthKey',
    type: 'object',
    properties: {
        password: { type: 'any', format: 'buffer' },
        password1: { type: 'any', format: 'buffer' },
    },
    required: ['password', 'password1'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, generateEthKeyS, { throwError: true });
        if (!(safe_buffer_1.Buffer.from(data.password)).equals(safe_buffer_1.Buffer.from(data.password1))) {
            throw new Error('auth:generate-key:pwdm');
        }
        const address = yield (getService(constants_1.AUTH_MODULE.auth)).generateKey(data.password);
        return { address };
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