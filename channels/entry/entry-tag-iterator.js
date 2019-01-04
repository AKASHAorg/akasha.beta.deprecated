"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const entryTagIteratorS = {
    id: '/entryTagIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
        tagName: { type: 'string', minLength: 1, maxLength: 32 },
        reversed: { type: 'boolean' },
        totalLoaded: { type: 'number' },
    },
    required: ['toBlock', 'tagName'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, entryTagIteratorS, { throwError: true });
        const entryCount = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
            .instance.Tags.totalEntries(data.tagName);
        let maxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
        if (maxResults > entryCount.toNumber()) {
            maxResults = entryCount.toNumber();
        }
        if (!data.tagName || entryCount <= data.totalLoaded) {
            return { collection: [], lastBlock: 0 };
        }
        if (data.totalLoaded) {
            const nextTotal = data.totalLoaded + maxResults;
            if (nextTotal > entryCount) {
                maxResults = entryCount - data.totalLoaded;
            }
        }
        return getService(constants_1.ENTRY_MODULE.helpers)
            .fetchFromTagIndex(Object.assign({}, data, {
            limit: maxResults,
            args: { tagName: data.tagName },
            reversed: data.reversed || false,
        }));
    });
    const entryTagIterator = { execute, name: 'entryTagIterator' };
    const service = function () {
        return entryTagIterator;
    };
    sp().service(constants_1.ENTRY_MODULE.entryTagIterator, service);
    return entryTagIterator;
}
exports.default = init;
//# sourceMappingURL=entry-tag-iterator.js.map