"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comments_1 = require("./comments");
const donations_1 = require("./donations");
const entries_1 = require("./entries");
const exclude_filter_1 = require("./exclude-filter");
const feed_1 = require("./feed");
const include_filter_1 = require("./include-filter");
const queue_1 = require("./queue");
const set_filter_1 = require("./set-filter");
const subscribe_1 = require("./subscribe");
const votes_1 = require("./votes");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const comment = comments_1.default(sp, getService);
    const donations = donations_1.default(sp, getService);
    const entries = entries_1.default(sp, getService);
    const excludeFilter = exclude_filter_1.default(sp, getService);
    const feed = feed_1.default(sp, getService);
    const includeFilter = include_filter_1.default(sp, getService);
    const queue = queue_1.default(sp, getService);
    const setFilter = set_filter_1.default(sp, getService);
    const subscribe = subscribe_1.default(sp, getService);
    const votes = votes_1.default(sp, getService);
    return {
        [constants_1.NOTIFICATIONS_MODULE.comments]: comment,
        [constants_1.NOTIFICATIONS_MODULE.donations]: donations,
        [constants_1.NOTIFICATIONS_MODULE.entriesCache]: entries,
        [constants_1.NOTIFICATIONS_MODULE.excludeFilter]: excludeFilter,
        [constants_1.NOTIFICATIONS_MODULE.feed]: feed,
        [constants_1.NOTIFICATIONS_MODULE.includeFilter]: includeFilter,
        [constants_1.NOTIFICATIONS_MODULE.queue]: queue,
        [constants_1.NOTIFICATIONS_MODULE.setFilter]: setFilter,
        [constants_1.NOTIFICATIONS_MODULE.subscribe]: subscribe,
        [constants_1.NOTIFICATIONS_MODULE.votes]: votes,
    };
};
const app = {
    init,
    moduleName: constants_1.NOTIFICATIONS_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map