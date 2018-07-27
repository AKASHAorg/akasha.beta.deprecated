"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const list_1 = require("./list");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* () {
        return { licences: list_1.licences };
    });
    const getLicences = { execute, name: 'getLicences' };
    const service = function () {
        return getLicences;
    };
    sp().service(constants_1.LICENCE_MODULE.getLicences, service);
    return getLicences;
}
exports.default = init;
//# sourceMappingURL=get-licences.js.map