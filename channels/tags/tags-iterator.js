"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const tagIteratorSchema = {
    id: '/tagIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
    },
    required: ['toBlock'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, tagIteratorSchema, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const fetched = yield contracts.fromEvent(contracts.instance.Tags.TagCreate, {}, data.toBlock, maxResults, {});
        for (const event of fetched.results) {
            collection.push({ tag: web3Api.instance.toUtf8(event.args.tag) });
            if (collection.length === maxResults) {
                break;
            }
        }
        return { collection, lastBlock: fetched.fromBlock };
    });
    const tagIterator = { execute, name: 'tagIterator' };
    const service = function () {
        return tagIterator;
    };
    sp().service(constants_1.TAGS_MODULE.tagIterator, service);
    return tagIterator;
}
exports.default = init;
//# sourceMappingURL=tags-iterator.js.map