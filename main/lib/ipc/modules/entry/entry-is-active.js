"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const active = yield index_1.constructed.instance.entries.isMutable(data.entryId);
    return { active: active, entryId: data.entryId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'isActive' };
//# sourceMappingURL=entry-is-active.js.map