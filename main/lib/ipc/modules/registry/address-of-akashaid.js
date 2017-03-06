"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const batch = data.map((profile) => {
        return index_1.constructed.instance.registry.addressOf(profile.akashaId);
    });
    const collection = yield Promise.all(batch);
    return { collection, request: data };
});
exports.default = { execute, name: 'addressOf' };
//# sourceMappingURL=address-of-akashaid.js.map