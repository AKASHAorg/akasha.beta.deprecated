"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const collection = yield index_1.constructed.instance.registry.getRegistered(data);
    return { collection };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'fetchRegistered' };
//# sourceMappingURL=fetch-registered.js.map