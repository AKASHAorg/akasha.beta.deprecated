"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const profile_data_1 = require("./profile-data");
exports.getProfileList = {
    id: '/getProfileList',
    type: 'array',
    items: {
        $ref: '/getProfileData',
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.addSchema(profile_data_1.getProfileDataSchema, '/getProfileData');
        v.validate(data, exports.getProfileList, { throwError: true });
        const profileData = getService(constants_1.PROFILE_MODULE.profileData);
        const pool = data.map((profile) => {
            return profileData.execute(profile, cb).then((profileData) => cb(null, profileData));
        });
        yield Promise.all(pool);
        return { done: true };
    });
    const getProfileLists = { execute, name: 'getProfileList', hasStream: true };
    const service = function () {
        return getProfileLists;
    };
    sp().service(constants_1.PROFILE_MODULE.getProfileList, service);
    return getProfileLists;
}
exports.default = init;
//# sourceMappingURL=get-profile-list.js.map