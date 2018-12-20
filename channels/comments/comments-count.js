"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const commentsCountS = {
    id: '/commentsCount',
    type: 'array',
    items: {
        type: 'string',
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, commentsCountS, { throwError: true });
        const collection = [];
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        for (const entryId of data) {
            const count = yield contracts.instance.Comments.totalComments(entryId);
            collection.push({ entryId, count: count.toNumber() });
        }
        return { collection };
    });
    const commentsCount = { execute, name: 'commentsCount' };
    const service = function () {
        return commentsCount;
    };
    sp().service(constants_1.COMMENTS_MODULE.commentsCount, service);
    return commentsCount;
}
exports.default = init;
//# sourceMappingURL=comments-count.js.map