"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const gethConnector = getService(constants_1.CORE_MODULE.GETH_CONNECTOR);
        const blockNr = gethConnector.getInstance().serviceStatus.api ?
            yield gethConnector.getInstance().web3.eth.getBlockNumber() : null;
        return { blockNr };
    });
    const status = { execute, name: 'status' };
    const service = function () {
        return status;
    };
    sp().service(constants_1.GETH_MODULE.status, service);
    return status;
}
exports.default = init;
//# sourceMappingURL=status.js.map