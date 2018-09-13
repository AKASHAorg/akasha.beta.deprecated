"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getCommentsCountSchema = {
    id: '/getCommentsCount',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.getCommentsCountSchema, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .profileAddress(data);
        const count = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Comments.totalCommentsOf(address);
        return { count: count.toString(10), akashaId: data.akashaId };
    });
    const commentsCount = { execute, name: 'getCommentsCount' };
    const service = function () {
        return commentsCount;
    };
    sp().service(constants_1.PROFILE_MODULE.getCommentsCount, service);
    return commentsCount;
}
exports.default = init;
//# sourceMappingURL=comments-count.js.map