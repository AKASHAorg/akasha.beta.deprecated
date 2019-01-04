"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_licence_by_Id_1 = require("./get-licence-by-Id");
const get_licences_1 = require("./get-licences");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const getLicenceById = get_licence_by_Id_1.default(sp, getService);
    const getLicences = get_licences_1.default(sp, getService);
    return {
        [constants_1.LICENCE_MODULE.getLicenceById]: getLicenceById,
        [constants_1.LICENCE_MODULE.getLicences]: getLicences,
    };
};
const app = {
    init,
    moduleName: constants_1.LICENCE_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map