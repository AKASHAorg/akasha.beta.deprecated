"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const getTagEntriesCountS = {
    id: '/getTagEntriesCount',
    type: 'array',
    items: {
        type: 'string',
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, getTagEntriesCountS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const requests = data.map((tag) => {
            return contracts.instance.Tags
                .totalEntries(tag)
                .then((count) => {
                return { count: count.toString(10), tag };
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const getTagEntriesCount = { execute, name: 'getTagEntriesCount' };
    const service = function () { return getTagEntriesCount; };
    sp().service(constants_1.ENTRY_MODULE.getTagEntriesCount, service);
    return getTagEntriesCount;
}
exports.default = init;
//# sourceMappingURL=entry-count-tag.js.map