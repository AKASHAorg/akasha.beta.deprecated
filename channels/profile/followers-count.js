"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getFollowersCountSchema = {
    id: '/getFollowersCount',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.getFollowersCountSchema, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .profileAddress(data);
        const count = yield getService(constants_1.CORE_MODULE.CONTRACTS).instance
            .Feed.totalFollowers(address);
        return { count: count.toString(10), akashaId: data.akashaId };
    });
    const followersCount = { execute, name: 'getFollowersCount' };
    const service = function () {
        return followersCount;
    };
    sp().service(constants_1.PROFILE_MODULE.followersCount, service);
    return followersCount;
}
exports.default = init;
//# sourceMappingURL=followers-count.js.map