"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const indexes_1 = require("./indexes");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const collection = [];
        const pageSize = data.limit || 10;
        const options = {
            beginsWith: data.text,
            field: 'akashaId',
            threshold: 1,
            limit: pageSize,
            type: 'ID',
        };
        indexes_1.dbs.profiles.searchIndex.match(options)
            .on('data', (data) => {
            collection.push({ akashaId: data.token, ethAddress: data.documents[0] });
        })
            .on('end', () => {
            cb('', { collection });
        });
        return {};
    });
    const findProfiles = { execute, name: 'findProfiles', hasStream: true };
    const service = function () {
        return findProfiles;
    };
    sp().service(constants_1.SEARCH_MODULE.findProfiles, service);
    return findProfiles;
}
exports.default = init;
//# sourceMappingURL=find-profiles.js.map