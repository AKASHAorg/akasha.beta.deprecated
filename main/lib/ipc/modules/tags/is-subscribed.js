"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const subscribed = yield index_1.constructed.instance.subs.isSubscribed(data.akashaId, data.tagName);
    return { subscribed, akashaId: data.akashaId, tagName: data.tagName };
});
exports.default = { execute, name: 'isSubscribed' };
//# sourceMappingURL=is-subscribed.js.map