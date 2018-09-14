"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const startServiceS = {
    id: '/startService',
    type: 'object',
    properties: {
        datadir: { type: 'string' },
        ipcpath: { type: 'string' },
        cache: { type: 'number' },
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, startServiceS, { throwError: true });
        const gethConnector = getService(constants_1.CORE_MODULE.GETH_CONNECTOR);
        console.log(gethConnector);
        if (gethConnector.getInstance().serviceStatus.process) {
            throw new Error('Geth is already running');
        }
        gethConnector.getInstance().setOptions(data);
        gethConnector.getInstance().enableDownloadEvents();
        yield gethConnector.getInstance().start();
        return {};
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(constants_1.GETH_MODULE.startService, service);
    return startService;
}
exports.default = init;
//# sourceMappingURL=start.js.map