"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const profileAddress = yield index_1.constructed.instance.registry.getByAddress(data.ethAddress);
    return { profileAddress };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getByAddress' };
//# sourceMappingURL=resolve-ethaddress.js.map