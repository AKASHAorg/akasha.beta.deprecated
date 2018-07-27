"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const followers_count_1 = require("./followers-count");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, followers_count_1.getFollowersCountSchema, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const count = yield getService(constants_1.CORE_MODULE.CONTRACTS).instance.Feed.totalFollowing(address);
        return { count: count.toString(10), akashaId: data.akashaId };
    });
    const followingCount = { execute, name: 'getFollowingCount' };
    const service = function () {
        return followingCount;
    };
    sp().service(constants_1.PROFILE_MODULE.followingCount, service);
    return followingCount;
}
exports.default = init;
//# sourceMappingURL=following-count.js.map