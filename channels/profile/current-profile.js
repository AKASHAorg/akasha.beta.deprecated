"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = () => getService(constants_1.PROFILE_MODULE.getByAddress).execute({ ethAddress: getService(constants_1.CORE_MODULE.WEB3_API).instance.eth.defaultAccount });
    const getCurrentProfile = { execute, name: 'getCurrentProfile' };
    const service = function () {
        return getCurrentProfile;
    };
    sp().service(constants_1.PROFILE_MODULE.getCurrentProfile, service);
    return getCurrentProfile;
}
exports.default = init;
//# sourceMappingURL=current-profile.js.map