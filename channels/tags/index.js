"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const can_create_1 = require("./can-create");
const check_format_1 = require("./check-format");
const create_tag_1 = require("./create-tag");
const exists_tag_1 = require("./exists-tag");
const fetch_tags_1 = require("./fetch-tags");
const tag_count_1 = require("./tag-count");
const tags_iterator_1 = require("./tags-iterator");
const search_tag_1 = require("./search-tag");
const sync_tags_1 = require("./sync-tags");
const constants_1 = require("@akashaproject/common/constants");
const init = function init(sp, getService) {
    const canCreate = can_create_1.default(sp, getService);
    const checkFormat = check_format_1.default(sp, getService);
    const createTag = create_tag_1.default(sp, getService);
    const existsTag = exists_tag_1.default(sp, getService);
    const fetchTags = fetch_tags_1.default(sp, getService);
    const tagCount = tag_count_1.default(sp, getService);
    const tagIterator = tags_iterator_1.default(sp, getService);
    const searchTag = search_tag_1.default(sp, getService);
    const syncTags = sync_tags_1.default(sp, getService);
    return {
        [constants_1.TAGS_MODULE.canCreate]: canCreate,
        [constants_1.TAGS_MODULE.checkFormat]: checkFormat,
        [constants_1.TAGS_MODULE.createTag]: createTag,
        [constants_1.TAGS_MODULE.existsTag]: existsTag,
        [constants_1.TAGS_MODULE.fetchTags]: fetchTags,
        [constants_1.TAGS_MODULE.tagCount]: tagCount,
        [constants_1.TAGS_MODULE.tagIterator]: tagIterator,
        [constants_1.TAGS_MODULE.searchTag]: searchTag,
        [constants_1.TAGS_MODULE.syncTags]: syncTags,
    };
};
const app = {
    init,
    moduleName: constants_1.TAGS_MODULE.$name,
};
exports.default = app;
//# sourceMappingURL=index.js.map