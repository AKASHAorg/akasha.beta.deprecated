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
exports.moduleName = 'notifications';
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
        comment,
        donations,
        entries,
        excludeFilter,
        feed,
        includeFilter,
        queue,
        setFilter,
        subscribe,
        votes,
    };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map