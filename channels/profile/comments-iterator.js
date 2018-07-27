"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ethereumjs_util_1 = require("ethereumjs-util");
exports.commentsIteratorSchema = {
    id: '/commentsIterator',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        lastBlock: { type: 'number' },
        lastIndex: { type: 'number' },
        limit: { type: 'number' },
        reversed: { type: 'boolean' },
    },
    required: ['lastBlock'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.commentsIteratorSchema, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const toBlock = (!data.lastBlock) ?
            yield getService(constants_1.CORE_MODULE.WEB3_API)
                .instance.eth.getBlockNumberAsync() : data.lastBlock;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const fetched = yield contracts.fromEvent(contracts.instance.Comments.Publish, { author: address }, toBlock, maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });
        for (const event of fetched.results) {
            collection.push({
                author: event.args.author,
                entryId: event.args.entryId,
                parent: ethereumjs_util_1.unpad(event.args.parent),
                commentId: event.args.id,
            });
        }
        return {
            collection,
            lastBlock: fetched.fromBlock,
            lastIndex: fetched.lastIndex,
            akashaId: data.akashaId,
            limit: maxResults,
        };
    });
    const commentsIterator = { execute, name: 'commentsIterator' };
    const service = function () {
        return commentsIterator;
    };
    sp().service(constants_1.PROFILE_MODULE.commentsIterator, service);
    return commentsIterator;
}
exports.default = init;
//# sourceMappingURL=comments-iterator.js.map