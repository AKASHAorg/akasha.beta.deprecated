"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_licence_by_Id_1 = require("./get-licence-by-Id");
const get_licences_1 = require("./get-licences");
exports.moduleName = 'licences';
const init = function init(sp, getService) {
    const getLicenceById = get_licence_by_Id_1.default(sp, getService);
    const getLicences = get_licences_1.default(sp, getService);
    return {
        getLicenceById,
        getLicences,
    };
};
const app = {
    init,
    moduleName: exports.moduleName,
};
exports.default = app;
//# sourceMappingURL=index.js.map