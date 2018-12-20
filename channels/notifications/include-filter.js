"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const set_filter_1 = require("./set-filter");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        data.profiles.forEach((profileAddress) => {
            set_filter_1.filter.appendAddress(profileAddress);
        });
        return Promise.resolve({ profiles: data.profiles });
    });
    const includeFilter = { execute, name: 'includeFilter' };
    const service = function () {
        return includeFilter;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.includeFilter, service);
    return includeFilter;
}
exports.default = init;
//# sourceMappingURL=include-filter.js.map