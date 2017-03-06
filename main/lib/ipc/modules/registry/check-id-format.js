"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const idValid = yield index_1.constructed.instance.registry.checkFormat(data.akashaId);
    return { idValid, akashaId: data.akashaId };
});
exports.default = { execute, name: 'checkIdFormat' };
//# sourceMappingURL=check-id-format.js.map