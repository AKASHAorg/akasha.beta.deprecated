import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
import { COMMON_MODULE, CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
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
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, update, { throwError: true });
        let ipfsEntry = new (getService(ENTRY_MODULE.ipfsEntryHelper)).IpfsEntry();
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const [fn, digestSize, hash] = yield contracts
            .instance.Entries.getEntry(data.ethAddress, data.entryId);
        if (!unpad(hash)) {
            throw new Error(`entryId: ${data.entryId} published by ${data.ethAddress} does not exits`);
        }
        const ipfsHashPublished = (getService(COMMON_MODULE.ipfsHelpers)).encodeHash(fn, digestSize, hash);
        const ipfsHash = yield ipfsEntry
            .edit(data.content, data.tags, data.entryType, ipfsHashPublished);
        const decodedHash = (getService(COMMON_MODULE.ipfsHelpers)).decodeHash(ipfsHash);
        delete data.content;
        delete data.tags;
        ipfsEntry = null;
        const txData = contracts.instance.Entries.edit.request(data.entryId, ...decodedHash);
        const receipt = yield contracts.send(txData, data.token, cb);
        return { receipt };
    });
    const editEntry = { execute, name: 'editEntry', hasStream: true };
    const service = function () {
        return editEntry;
    };
    sp().service(ENTRY_MODULE.editEntry, service);
    return editEntry;
}
//# sourceMappingURL=edit-entry.js.map