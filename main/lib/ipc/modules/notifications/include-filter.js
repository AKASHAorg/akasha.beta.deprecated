"use strict";
const Promise = require("bluebird");
const set_filter_1 = require("./set-filter");
const execute = Promise.coroutine(function* (data) {
    data.profiles.forEach((profileAddress) => {
        set_filter_1.filter.appendAddress(profileAddress);
    });
    return Promise.resolve({ profiles: data.profiles });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'includeFilter' };
//# sourceMappingURL=include-filter.js.map