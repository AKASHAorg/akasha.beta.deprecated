"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const index_2 = require('../auth/index');
const execute = Promise.coroutine(function* (data) {
    const txData = yield index_1.constructed.instance.profile.sendTip(data.receiver, data.value, data.unit, data.gas);
    const tx = yield index_2.module.auth.signData(txData, data.token);
    return { tx, receiver: data.receiver };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'tip' };
//# sourceMappingURL=send-tip.js.map