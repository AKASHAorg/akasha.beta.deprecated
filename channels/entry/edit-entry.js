"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ethereumjs_util_1 = require("ethereumjs-util");
const constants_1 = require("@akashaproject/common/constants");
const update = {
    id: '/publish',
    type: 'object',
    properties: {
        content: {
            type: 'object',
        },
        token: {
            type: 'string',
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            minItems: 1,
        },
        entryType: {
            type: 'number',
        },
        ethAddress: { type: 'string', format: 'address' },
    },
    required: ['content', 'token', 'tags', 'ethAddress', 'entryType'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, update, { throwError: true });
        let ipfsEntry = new getService(constants_1.ENTRY_MODULE.ipfsEntryHelper).IpfsEntry();
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const [fn, digestSize, hash] = yield contracts.instance
            .Entries.getEntry(data.ethAddress, data.entryId);
        if (!ethereumjs_util_1.unpad(hash)) {
            throw new Error(`entryId: ${data.entryId} published by ${data.ethAddress} does not exits`);
        }
        const ipfsHashPublished = getService(constants_1.COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
        const ipfsHash = yield ipfsEntry
            .edit(data.content, data.tags, data.entryType, ipfsHashPublished);
        const decodedHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
        delete data.content;
        delete data.tags;
        ipfsEntry = null;
        const txData = contracts.instance.Entries.edit.request(data.entryId, ...decodedHash);
        const transaction = yield contracts.send(txData, data.token, cb);
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const editEntry = { execute, name: 'editEntry', hasStream: true };
    const service = function () {
        return editEntry;
    };
    sp().service(constants_1.ENTRY_MODULE.editEntry, service);
    return editEntry;
}
exports.default = init;
//# sourceMappingURL=edit-entry.js.map