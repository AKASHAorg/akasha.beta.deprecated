"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const profile_data_1 = require("./profile-data");
const execute = Promise.coroutine(function* (data) {
    const pool = data.map((profile) => {
        return profile_data_1.default.execute(profile);
    });
    const collection = yield Promise.all(pool);
    return { collection: collection, resolve: data };
});
exports.default = { execute, name: 'getProfileList' };
//# sourceMappingURL=get-profile-list.js.map