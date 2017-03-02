"use strict";
const index_1 = require("../auth/index");
const Promise = require("bluebird");
const index_2 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const txData = yield index_2.constructed.instance.registry.unregister(data.akashaId, data.gas);
    const tx = yield index_1.module.auth.signData(txData, data.token);
    return { tx };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'unregister' };
//# sourceMappingURL=unregister-profile.js.map