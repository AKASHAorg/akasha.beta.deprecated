"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_registered_1 = require("./fetch-registered");
const profile_exists_1 = require("./profile-exists");
const register_profile_1 = require("./register-profile");
const address_of_akashaid_1 = require("./address-of-akashaid");
const check_id_format_1 = require("./check-id-format");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const fetchRegistered = fetch_registered_1.default(sp, getService);
    const profileExists = profile_exists_1.default(sp, getService);
    const checkIdFormat = check_id_format_1.default(sp, getService);
    const registerProfile = register_profile_1.default(sp, getService);
    const addressOf = address_of_akashaid_1.default(sp, getService);
    return {
        [constants_1.REGISTRY_MODULE.fetchRegistered]: fetchRegistered,
        [constants_1.REGISTRY_MODULE.profileExists]: profileExists,
        [constants_1.REGISTRY_MODULE.checkIdFormat]: checkIdFormat,
        [constants_1.REGISTRY_MODULE.registerProfile]: registerProfile,
        [constants_1.REGISTRY_MODULE.addressOf]: addressOf,
    };
};
const app = {
    init,
    moduleName: constants_1.REGISTRY_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map