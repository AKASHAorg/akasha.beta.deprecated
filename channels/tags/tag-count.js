"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const count = yield (getService(constants_1.CORE_MODULE.CONTRACTS)).instance.Tags.total();
        return { count: count.toString(10) };
    });
    const tagCount = { execute, name: 'tagCount' };
    const service = function () {
        return tagCount;
    };
    sp().service(constants_1.TAGS_MODULE.tagCount, service);
    return tagCount;
}
exports.default = init;
//# sourceMappingURL=tag-count.js.map