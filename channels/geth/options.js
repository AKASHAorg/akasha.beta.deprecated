"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const options = getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance().setOptions(data);
        const mapObj = Object.create(null);
        for (const [k, v] of options) {
            mapObj[k] = v;
        }
        return mapObj;
    });
    const options = { execute, name: 'options' };
    const service = function () {
        return options;
    };
    sp().service(constants_1.GETH_MODULE.options, service);
    return options;
}
exports.default = init;
//# sourceMappingURL=options.js.map