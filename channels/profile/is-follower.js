"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.isFollowerSchema = {
    id: '/isFollower',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            ethAddressFollower: { type: 'string', format: 'address' },
            ethAddressFollowing: { type: 'string', format: 'address' },
            akashaIdFollower: { type: 'string' },
            akashaIdFollowing: { type: 'string' },
        },
    },
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.isFollowerSchema, { throwError: true });
        const profileHelpers = getService(constants_1.COMMON_MODULE.profileHelpers);
        const requests = data.map((req) => {
            let addressFollower;
            let addressFollowing;
            return profileHelpers
                .profileAddress({ akashaId: req.akashaIdFollower, ethAddress: req.ethAddressFollower })
                .then((data1) => {
                addressFollower = data1;
                return profileHelpers.profileAddress({ akashaId: req.akashaIdFollowing, ethAddress: req.ethAddressFollowing });
            })
                .then((data1) => {
                addressFollowing = data1;
                return getService(constants_1.CORE_MODULE.CONTRACTS)
                    .instance.Feed.follows(addressFollower, addressFollowing);
            })
                .then((result) => {
                return { result, addressFollower, addressFollowing };
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const isFollower = { execute, name: 'isFollower' };
    const service = function () {
        return isFollower;
    };
    sp().service(constants_1.PROFILE_MODULE.isFollower, service);
    return isFollower;
}
exports.default = init;
//# sourceMappingURL=is-follower.js.map