"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ethereumjs_util_1 = require("ethereumjs-util");
const check_id_format_1 = require("./check-id-format");
exports.addressOfSchema = {
    id: '/addressOf',
    type: 'array',
    items: {
        $ref: '/checkIdFormat',
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.addSchema(check_id_format_1.checkIdFormatSchema, '/checkIdFormat');
        v.validate(data, exports.addressOfSchema, { throwError: true });
        const batch = data.map((profile) => {
            return (getService(constants_1.CORE_MODULE.CONTRACTS)).instance
                .ProfileResolver.addr(profile.akashaId).then((address) => {
                return { address: ethereumjs_util_1.unpad(address), akashaId: profile.akashaId };
            });
        });
        const collection = yield Promise.all(batch);
        return { collection };
    });
    const addressOf = { execute, name: 'addressOf' };
    const service = function () {
        return addressOf;
    };
    sp().service(constants_1.REGISTRY_MODULE.addressOf, service);
    return addressOf;
}
exports.default = init;
//# sourceMappingURL=address-of-akashaid.js.map