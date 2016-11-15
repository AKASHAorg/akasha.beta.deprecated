"use strict";
const Promise = require('bluebird');
let entries;
let comments;
let votes;
const execute = Promise.coroutine(function* (data) {
    if (data.stop && entries) {
        entries.stopWatching(() => { entries = null; });
        comments.stopWatching(() => { comments = null; });
        votes.stopWatching(() => { votes = null; });
    }
    return {};
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getFollowingCount' };
//# sourceMappingURL=feed.js.map