"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.resolveEntriesIpfsHashS = {
    id: '/resolveEntriesIpfsHash',
    type: 'object',
    properties: {
        ipfsHash: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            minItems: 1,
        },
        full: { type: 'boolean' },
    },
    required: ['ipfsHash'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.resolveEntriesIpfsHashS, { throwError: true });
        const SHORT_WAIT_TIME = getService(constants_1.CORE_MODULE.SETTINGS).get(constants_1.GENERAL_SETTINGS.OP_WAIT_TIME);
        const { getFullContent, getShortContent } = getService(constants_1.ENTRY_MODULE.ipfs);
        const fetchData = (data.full) ? getFullContent : getShortContent;
        data.ipfsHash.forEach((ipfsHash) => {
            fetchData(ipfsHash, false)
                .timeout(SHORT_WAIT_TIME)
                .then((entry) => {
                cb(null, { entry, ipfsHash });
            })
                .catch((err) => {
                cb({ message: err.message, ipfsHash });
            });
        });
        return {};
    });
    const resolveEntriesIpfsHash = { execute, name: 'resolveEntriesIpfsHash', hasStream: true };
    const service = function () {
        return resolveEntriesIpfsHash;
    };
    sp().service(constants_1.ENTRY_MODULE.resolveEntriesIpfsHash, service);
    return resolveEntriesIpfsHash;
}
exports.default = init;
//# sourceMappingURL=resolve-entries-ipfs-hash.js.map