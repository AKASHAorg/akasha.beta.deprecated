"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const get_entry_1 = require("./get-entry");
const constants_1 = require("@akashaproject/common/constants");
exports.getEntryListS = {
    id: '/getEntryList',
    type: 'array',
    items: {
        $ref: '/getEntry',
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.addSchema(get_entry_1.getEntry, '/getEntry');
        v.validate(data, exports.getEntryListS, { throwError: true });
        const getEntry = getService(constants_1.ENTRY_MODULE.getEntry);
        for (const entryObj of data) {
            getEntry.execute(entryObj).then((result) => cb('', {
                data: result,
                entryId: entryObj.entryId,
                ethAddress: entryObj.ethAddress,
                akashaId: entryObj.akashaId,
            }));
        }
        return {};
    });
    const getEntryList = { execute, name: 'getEntryList', hasStream: true };
    const service = function () {
        return getEntryList;
    };
    sp().service(constants_1.ENTRY_MODULE.getEntryList, service);
    return getEntryList;
}
exports.default = init;
//# sourceMappingURL=get-entry-list.js.map