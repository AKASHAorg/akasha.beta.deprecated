"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
const clear_index_1 = require("./clear-index");
const find_tags_1 = require("./find-tags");
const find_profiles_1 = require("./find-profiles");
const indexes_1 = require("./indexes");
const constants_1 = require("@akashaproject/common/constants");
const init = async function init(sp, getService) {
    const query = query_1.default(sp, getService);
    const flush = clear_index_1.default(sp, getService);
    const findTags = find_tags_1.default(sp, getService);
    const findProfiles = find_profiles_1.default(sp, getService);
    indexes_1.default(sp);
    return {
        [constants_1.SEARCH_MODULE.query]: query,
        [constants_1.SEARCH_MODULE.flush]: flush,
        [constants_1.SEARCH_MODULE.findTags]: findTags,
        [constants_1.SEARCH_MODULE.findProfiles]: findProfiles,
    };
};
const app = {
    init,
    moduleName: constants_1.SEARCH_MODULE.$name,
    async: true,
};
exports.default = app;
//# sourceMappingURL=index.js.map