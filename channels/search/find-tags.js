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
            field: 'tagName',
            threshold: 1,
            limit: pageSize,
            type: 'simple',
        };
        indexes_1.dbs.tags
            .searchIndex
            .match(options)
            .on('data', (data) => {
            collection.push(data);
        })
            .on('end', () => {
            cb('', { collection });
        });
        return {};
    });
    const findTags = { execute, name: 'findTags', hasStream: true };
    const service = function () {
        return findTags;
    };
    sp().service(constants_1.SEARCH_MODULE.findTags, service);
    return findTags;
}
exports.default = init;
//# sourceMappingURL=find-tags.js.map