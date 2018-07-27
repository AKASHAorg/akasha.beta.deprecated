"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.updateProfileData = {
    id: '/updateProfileData',
    type: 'object',
    properties: {
        ipfs: {
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                avatar: { type: 'any' },
                backgroundImage: { type: 'any' },
                about: { type: 'string' },
                links: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            url: { type: 'string' },
                            type: { type: 'string' },
                            id: { type: 'number' },
                        },
                        required: ['title', 'url', 'type', 'id'],
                    },
                },
            },
        },
        token: { type: 'string' },
    },
    required: ['ipfs', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.updateProfileData, { throwError: true });
        const ipfsHash = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .ipfsCreateProfile(data.ipfs);
        console.log('mainipfsHash', ipfsHash);
        const decodedHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
        const currentProfile = yield getService(constants_1.PROFILE_MODULE.getCurrentProfile).execute();
        if (!currentProfile.raw) {
            throw new Error('No profile found to update');
        }
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = contracts.instance.ProfileResolver
            .setHash.request(currentProfile.raw, ...decodedHash);
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const updateProfileDatas = { execute, name: 'updateProfileData', hasStream: true };
    const service = function () {
        return updateProfileDatas;
    };
    sp().service(constants_1.PROFILE_MODULE.updateProfileData, service);
    return updateProfileDatas;
}
exports.default = init;
//# sourceMappingURL=update-profile.js.map