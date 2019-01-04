"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.syncTagsSchema = {
    id: '/syncTags',
    type: 'object',
    properties: {
        fromBlock: { type: 'number' },
    },
    required: ['fromBlock'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.syncTagsSchema, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const tagCreateEvent = contracts.createWatcher(contracts.instance.Tags.TagCreate, {}, data.fromBlock);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const dbIndex = getService(constants_1.CORE_MODULE.DB_INDEX);
        const toUtf8 = web3Api.instance.toUtf8;
        tagCreateEvent.watch((err, event) => {
            const data = { id: event.args.tag, tagName: toUtf8(event.args.tag) };
            dbIndex.tags
                .searchIndex
                .concurrentAdd({}, [data], (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
        const lastBlock = yield web3Api.instance.eth.getBlockNumber();
        return { lastBlock, done: true };
    });
    const syncTags = { execute, name: 'syncTags' };
    const service = function () {
        return syncTags;
    };
    sp().service(constants_1.TAGS_MODULE.syncTags, service);
    return syncTags;
}
exports.default = init;
//# sourceMappingURL=sync-tags.js.map