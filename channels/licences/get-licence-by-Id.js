"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const list_1 = require("./list");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        return { license: list_1.getLicence(data.id) };
    });
    const getLicenceById = { execute, name: 'getLicenceById' };
    const service = function () {
        return getLicenceById;
    };
    sp().service(constants_1.LICENCE_MODULE.getLicenceById, service);
    return getLicenceById;
}
exports.default = init;
//# sourceMappingURL=get-licence-by-Id.js.map