import * as Promise from 'bluebird';
import { CORE_MODULE, GENERAL_SETTINGS, PROFILE_MODULE } from '@akashaproject/common/constants';
export const resolveProfileIpfsHash = {
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
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, resolveProfileIpfsHash, { throwError: true });
        const resolveProfile = getService(PROFILE_MODULE.resolveProfile);
        const getShortProfile = getService(PROFILE_MODULE.getShortProfile);
        const settings = getService(CORE_MODULE.SETTINGS);
        const resolve = (data.full) ? resolveProfile : getShortProfile;
        data.ipfsHash.forEach((profileHash) => {
            resolve(profileHash, false)
                .timeout(settings.get(GENERAL_SETTINGS.OP_WAIT_TIME) || 15000)
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
    sp().service(PROFILE_MODULE.resolveProfileIpfsHash, service);
    return resolveProfileIpfsHashes;
}
//# sourceMappingURL=resolve-profile-ipfs-hash.js.map