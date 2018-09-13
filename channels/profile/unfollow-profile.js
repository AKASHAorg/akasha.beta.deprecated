"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const follow_profile_1 = require("./follow-profile");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, follow_profile_1.followProfileSchema, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers)
            .profileAddress(data);
        const txData = contracts.instance.Feed
            .unFollow.request(address, { gas: 400000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        getService(constants_1.CORE_MODULE.STASH).mixed.flush();
        return { tx: transaction.tx, receipt: transaction.receipt, akashaId: data.akashaId };
    });
    const unFollowProfile = { execute, name: 'unFollowProfile', hasStream: true };
    const service = function () {
        return unFollowProfile;
    };
    sp().service(constants_1.PROFILE_MODULE.unFollowProfile, service);
    return unFollowProfile;
}
exports.default = init;
//# sourceMappingURL=unfollow-profile.js.map