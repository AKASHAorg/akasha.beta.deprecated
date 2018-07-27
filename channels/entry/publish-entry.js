"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const publishS = {
    id: '/publish',
    type: 'object',
    properties: {
        content: {
            type: 'object',
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
        token: {
            type: 'string',
        },
    },
    required: ['content', 'tags', 'entryType', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, publishS, { throwError: true });
        let ipfsEntry = new getService(constants_1.ENTRY_MODULE.ipfs).IpfsEntry();
        const ipfsHash = yield ipfsEntry.create(data.content, data.tags, data.entryType);
        const decodedHash = getService(constants_1.COMMON_MODULE.ipfsHelpers).decodeHash(ipfsHash);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const tags = data.tags.map(tag => web3Api.instance.fromUtf8(tag));
        let publishMethod;
        switch (data.entryType) {
            case 0:
                publishMethod = contracts.instance.Entries.publishArticle;
                break;
            case 1:
                publishMethod = contracts.instance.Entries.publishLink;
                break;
            case 2:
                publishMethod = contracts.instance.Entries.publishMedia;
                break;
            default:
                publishMethod = contracts.instance.Entries.publishOther;
        }
        const txData = publishMethod.request(...decodedHash, tags, { gas: 600000 });
        ipfsEntry = null;
        delete data.content;
        delete data.tags;
        const transaction = yield contracts.send(txData, data.token, cb);
        let entryId = null;
        const receipt = transaction.receipt;
        if (receipt.logs && receipt.logs.length > 2) {
            const log = receipt.logs[receipt.logs.length - 1];
            entryId = log.topics.length > 2 ? log.topics[2] : null;
        }
        yield getService(constants_1.NOTIFICATIONS_MODULE.entriesCache).push(entryId);
        return { tx: transaction.tx, receipt: transaction.receipt, entryId };
    });
    const publish = { execute, name: 'publish', hasStream: true };
    const service = function () {
        return publish;
    };
    sp().service(constants_1.ENTRY_MODULE.publish, service);
    return publish;
}
exports.default = init;
//# sourceMappingURL=publish-entry.js.map