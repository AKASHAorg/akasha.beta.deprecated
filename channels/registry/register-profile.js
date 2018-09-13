"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.registerProfileSchema = {
    id: '/registerProfile',
    type: 'object',
    properties: {
        akashaId: { type: 'string', minLength: 2 },
        ethAddress: { type: 'string', format: 'address' },
        donationsEnabled: { type: 'boolean' },
        ipfs: { $ref: '/profileSchema' },
        token: { type: 'string' },
    },
    required: ['akashaId', 'ethAddress', 'donationsEnabled', 'ipfs', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.addSchema(constants_1.IMG_SIZE_SCHEMA, '/imgSize');
        v.addSchema(constants_1.PROFILE_SCHEMA, '/profileSchema');
        v.validate(data, exports.registerProfileSchema, { throwError: true });
        const normalisedId = getService(constants_1.COMMON_MODULE.profileHelpers).normaliseId(data.akashaId);
        const check = yield getService(constants_1.REGISTRY_MODULE.checkIdFormat)
            .execute({ akashaId: normalisedId });
        if (!check.idValid) {
            throw new Error('Invalid akashaId');
        }
        const ipfsHash = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .ipfsCreateProfile(data.ipfs);
        const [hash, fn, digest] = getService(constants_1.COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
        const txData = getService(constants_1.CORE_MODULE.CONTRACTS).instance
            .ProfileRegistrar
            .register.request(normalisedId, data.donationsEnabled, hash, fn, digest, {
            gas: 400000,
            from: data.ethAddress,
        });
        const transaction = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const registerProfile = { execute, name: 'registerProfile', hasStream: true };
    const service = function () {
        return registerProfile;
    };
    sp().service(constants_1.REGISTRY_MODULE.registerProfile, service);
    return registerProfile;
}
exports.default = init;
//# sourceMappingURL=register-profile.js.map