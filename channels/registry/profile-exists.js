"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ethereumjs_util_1 = require("ethereumjs-util");
const check_id_format_1 = require("./check-id-format");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, check_id_format_1.checkIdFormatSchema, { throwError: true });
        let normalisedId;
        let exists;
        let idValid;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        try {
            normalisedId = getService(constants_1.COMMON_MODULE.profileHelpers)
                .normaliseId(data.akashaId);
            const idHash = yield contracts.instance.ProfileRegistrar.hash(normalisedId);
            exists = yield contracts.instance.ProfileResolver.addr(idHash);
            idValid = yield contracts.instance.ProfileRegistrar.check_format(normalisedId);
        }
        catch (err) {
            normalisedId = '';
            exists = '0x0';
            idValid = false;
        }
        return { idValid, normalisedId, exists: !!ethereumjs_util_1.unpad(exists), akashaId: data.akashaId };
    });
    const profileExists = { execute, name: 'profileExists' };
    const service = function () {
        return profileExists;
    };
    sp().service(constants_1.REGISTRY_MODULE.profileExists, service);
    return profileExists;
}
exports.default = init;
//# sourceMappingURL=profile-exists.js.map