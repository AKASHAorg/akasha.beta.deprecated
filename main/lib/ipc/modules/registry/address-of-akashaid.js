"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const profileAddress = yield index_1.constructed.instance.registry.addressOf(data.akashaId);
    return { profileAddress, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'addressOf' };
//# sourceMappingURL=address-of-akashaid.js.map