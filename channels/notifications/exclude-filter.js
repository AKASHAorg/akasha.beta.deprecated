"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const set_filter_1 = require("./set-filter");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        data.profiles.forEach((profileAddress) => {
            set_filter_1.filter.removeAddress(profileAddress);
        });
        return Promise.resolve({ profiles: data.profiles });
    });
    const excludeFilter = { execute, name: 'excludeFilter' };
    const service = function () {
        return excludeFilter;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.excludeFilter, service);
    return excludeFilter;
}
exports.default = init;
//# sourceMappingURL=exclude-filter.js.map