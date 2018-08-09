"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const entryProfileIteratorS = {
    id: '/entryProfileIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        reversed: { type: 'boolean' },
        totalLoaded: { type: 'number' },
    },
    required: ['toBlock'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, entryProfileIteratorS, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const entryCount = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Entries.getEntryCount(address);
        let maxResults = entryCount.toNumber() === 0 ? 0 : data.limit || 5;
        if (maxResults > entryCount.toNumber()) {
            maxResults = entryCount.toNumber();
        }
        if (!address || entryCount <= data.totalLoaded) {
            return { collection: [], lastBlock: 0 };
        }
        if (data.totalLoaded) {
            const nextTotal = data.totalLoaded + maxResults;
            if (nextTotal > entryCount) {
                maxResults = entryCount - data.totalLoaded;
            }
        }
        return getService(constants_1.ENTRY_MODULE.helpers).fetchFromPublish(Object.assign({}, data, {
            limit: maxResults,
            args: { author: address },
            reversed: data.reversed || false,
        }));
    });
    const entryProfileIterator = { execute, name: 'entryProfileIterator' };
    const service = function () {
        return entryProfileIterator;
    };
    sp().service(constants_1.ENTRY_MODULE.entryProfileIterator, service);
    return entryProfileIterator;
}
exports.default = init;
//# sourceMappingURL=entry-profile-iterator.js.map