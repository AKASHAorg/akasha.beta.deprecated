"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const index_2 = require("../auth/index");
const address_of_akashaid_1 = require("../registry/address-of-akashaid");
const execute = Promise.coroutine(function* (data) {
    const validateReceiver = yield address_of_akashaid_1.default.execute([{ akashaId: data.akashaId }]);
    if (validateReceiver.collection[0] !== data.receiver) {
        throw new Error("Cannot validate receiver's address.");
    }
    const txData = yield index_1.constructed.instance.profile.sendTip(data.receiver, data.value, data.unit, data.gas);
    const tx = yield index_2.module.auth.signData(txData, data.token);
    return { tx, receiver: data.receiver, akashaId: data.akashaId };
});
exports.default = { execute, name: 'tip' };
//# sourceMappingURL=send-tip.js.map