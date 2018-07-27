"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ethereumjs_util_1 = require("ethereumjs-util");
exports.getByAddressSchema = {
    id: '/getByAddress',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
    },
    required: ['ethAddress'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.getByAddressSchema, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        let resolved;
        let profileHex = yield contracts.instance.ProfileResolver.reverse(data.ethAddress);
        if (!ethereumjs_util_1.unpad(profileHex)) {
            profileHex = null;
        }
        else {
            resolved = yield contracts.instance.ProfileResolver.resolve(profileHex);
        }
        const akashaId = (profileHex) ? web3Api.instance.toUtf8(resolved[0]) : '';
        return { ethAddress: data.ethAddress, akashaId, raw: profileHex };
    });
    const getByAddress = { execute, name: 'getByAddress' };
    const service = function () {
        return getByAddress;
    };
    sp().service(constants_1.PROFILE_MODULE.getByAddress, service);
    return getByAddress;
}
exports.default = init;
//# sourceMappingURL=resolve-ethaddress.js.map