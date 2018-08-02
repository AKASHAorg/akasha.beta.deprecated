"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const getProfileEntriesCountS = {
    id: '/getProfileEntriesCount',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
    },
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, getProfileEntriesCountS, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const count = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Entries.getEntryCount(address);
        return { count: count.toString(10) };
    });
    const getProfileEntriesCount = { execute, name: 'getProfileEntriesCount' };
    const service = function () { return getProfileEntriesCount; };
    sp().service(constants_1.ENTRY_MODULE.getProfileEntriesCount, service);
    return getProfileEntriesCount;
}
exports.default = init;
//# sourceMappingURL=entry-count-profile.js.map