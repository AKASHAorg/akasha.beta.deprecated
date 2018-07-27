"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.resolveProfileIpfsHash = {
    id: '/resolveProfileIpfsHash',
    type: 'object',
    properties: {
        ipfsHash: {
            type: 'array',
            items: { type: 'string', format: 'multihash' },
            uniqueItems: true,
            minItems: 1,
        },
        full: {
            type: 'boolean',
        },
    },
    required: ['ipfsHash'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.resolveProfileIpfsHash, { throwError: true });
        const resolveProfile = getService(constants_1.PROFILE_MODULE.resolveProfile);
        const getShortProfile = getService(constants_1.PROFILE_MODULE.getShortProfile);
        const settings = getService(constants_1.CORE_MODULE.SETTINGS);
        const resolve = (data.full) ? resolveProfile : getShortProfile;
        data.ipfsHash.forEach((profileHash) => {
            resolve(profileHash, false)
                .timeout(settings.get(constants_1.GENERAL_SETTINGS.OP_WAIT_TIME) || 15000)
                .then((profile) => {
                cb(null, { profile, ipfsHash: profileHash });
            })
                .catch((err) => {
                cb({ message: err.message, ipfsHash: profileHash });
            });
        });
        return {};
    });
    const resolveProfileIpfsHashes = { execute, name: 'resolveProfileIpfsHash', hasStream: true };
    const service = function () {
        return resolveProfileIpfsHashes;
    };
    sp().service(constants_1.PROFILE_MODULE.resolveProfileIpfsHash, service);
    return resolveProfileIpfsHashes;
}
exports.default = init;
//# sourceMappingURL=resolve-profile-ipfs-hash.js.map