"use strict";
const Promise = require("bluebird");
const profile_data_1 = require("./profile-data");
const execute = Promise.coroutine(function* (data) {
    const pool = data.map((profile) => {
        return profile_data_1.default.executeri(profile);
    });
    const collection = yield Promise.all(pool);
    return { collection: collection, resolve: data };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getProfileList' };
//# sourceMappingURL=get-profile-list.js.map