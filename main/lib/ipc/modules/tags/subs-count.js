"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.subs.subsCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'subsCount' };
//# sourceMappingURL=subs-count.js.map