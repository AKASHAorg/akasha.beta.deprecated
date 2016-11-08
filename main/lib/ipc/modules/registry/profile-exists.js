"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const execute = Promise.coroutine(function* (data) {
    const exists = yield index_1.constructed.instance.registry.profileExists(data.akashaId);
    return { exists, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'profileExists' };
//# sourceMappingURL=profile-exists.js.map