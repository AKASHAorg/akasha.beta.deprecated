"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.checkIdFormatSchema = {
    id: '/checkIdFormat',
    type: 'object',
    properties: {
        akashaId: { type: 'string', minLength: 2 },
    },
    required: ['akashaId'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.checkIdFormatSchema, { throwError: true });
        const idValid = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
            .instance.ProfileRegistrar.check_format(data.akashaId);
        return { idValid, akashaId: data.akashaId };
    });
    const checkIdFormat = { execute, name: 'checkIdFormat' };
    const service = function () {
        return checkIdFormat;
    };
    sp().service(constants_1.REGISTRY_MODULE.checkIdFormat, service);
    return checkIdFormat;
}
exports.default = init;
//# sourceMappingURL=check-id-format.js.map