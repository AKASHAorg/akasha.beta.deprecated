"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("./constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        yield (getService(constants_1.CORE_MODULE.CONTRACTS)).stopAllWatchers();
        yield (getService(constants_1.NOTIFICATIONS_MODULE.subscribe)).execute({
            settings: { feed: false, donations: false, comments: false, votes: false },
            profile: {}, fromBlock: 0,
        }, () => {
        });
        (getService(constants_1.AUTH_MODULE.auth)).logout();
        return { done: true };
    });
    const logout = { execute, name: 'logout' };
    const service = function () {
        return logout;
    };
    sp().service(constants_1.COMMON_MODULE.logout, service);
    return logout;
}
exports.default = init;
//# sourceMappingURL=logout.js.map