"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_to_queue_1 = require("./add-to-queue");
const emit_mined_1 = require("./emit-mined");
const get_transaction_1 = require("./get-transaction");
exports.moduleName = 'tx';
const init = function init(sp, getService) {
    const addToQueue = add_to_queue_1.default(sp, getService);
    const emitMined = emit_mined_1.default(sp, getService);
    const getTransaction = get_transaction_1.default(sp, getService);
    return { addToQueue, emitMined, getTransaction };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map