"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ethereumjs_util_1 = require("ethereumjs-util");
const constants_1 = require("@akashaproject/common/constants");
const getEntryIpfsHashS = {
    id: '/getEntryIpfsHash',
    type: 'object',
    properties: {
        entryId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
    },
    required: ['entryId'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, getEntryIpfsHashS, { throwError: true });
        let ipfsHash;
        const ethAddress = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const [fn, digestSize, hash] = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Entries.getEntry(ethAddress, data.entryId);
        if (!!ethereumjs_util_1.unpad(hash)) {
            ipfsHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
        }
        return { ipfsHash };
    });
    const getEntryIpfsHash = { execute, name: 'getEntryIpfsHash' };
    const service = function () {
        return getEntryIpfsHash;
    };
    sp().service(constants_1.ENTRY_MODULE.getEntryIpfsHash, service);
    return getEntryIpfsHash;
}
exports.default = init;
//# sourceMappingURL=get-entry-ipfs-hash.js.map