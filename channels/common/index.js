"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ipfs_helpers_1 = require("./ipfs-helpers");
const profile_helpers_1 = require("./profile-helpers");
const get_local_identities_1 = require("./get-local-identities");
const login_1 = require("./login");
const logout_1 = require("./logout");
const request_aeth_1 = require("./request-aeth");
exports.moduleName = 'common';
const init = function init(sp, getService) {
    ipfs_helpers_1.default(sp);
    profile_helpers_1.default(sp, getService);
    const getLocalIdentities = get_local_identities_1.default(sp, getService);
    const login = login_1.default(sp, getService);
    const logout = logout_1.default(sp, getService);
    const requestAeth = request_aeth_1.default(sp, getService);
    return {
        getLocalIdentities,
        login,
        logout,
        requestAeth,
    };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map