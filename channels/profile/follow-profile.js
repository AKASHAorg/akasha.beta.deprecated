"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.followProfileSchema = {
    id: '/followProfile',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.followProfileSchema, { throwError: true });
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const txData = contracts.instance.Feed.follow.request(address, { gas: 400000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        getService(constants_1.CORE_MODULE.STASH).mixed.flush();
        return { tx: transaction.tx, receipt: transaction.receipt };
    });
    const followProfile = { execute, name: 'followProfile', hasStream: true };
    const service = function () {
        return followProfile;
    };
    sp().service(constants_1.PROFILE_MODULE.followProfile, service);
    return followProfile;
}
exports.default = init;
//# sourceMappingURL=follow-profile.js.map