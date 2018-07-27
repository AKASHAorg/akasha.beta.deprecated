"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.searchTagSchema = {
    id: '/searchTag',
    type: 'object',
    properties: {
        tagName: { type: 'string', minLength: 2 },
        limit: { type: 'number' },
    },
    required: ['tagName', 'limit'],
};
exports.cacheKey = 'search:tags:all';
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.searchTagSchema, { throwError: true });
        const stash = getService(constants_1.CORE_MODULE.STASH);
        if (!stash.mixed.hasFull(exports.cacheKey)) {
            const filter = getService(constants_1.CORE_MODULE.CONTRACTS)
                .instance.Tags.TagCreate({}, { fromBlock: 0, toBlock: 'latest' });
            yield Promise
                .fromCallback((cb) => filter.get(cb)).then((collection) => {
                const tags = collection.map((el) => {
                    return getService(constants_1.CORE_MODULE.WEB3_API).instance.toUtf8(el.args.tag);
                });
                stash.mixed.setFull(exports.cacheKey, tags);
                return true;
            });
        }
        const collection = (stash.mixed.getFull(exports.cacheKey)).filter((currentTag) => {
            return currentTag.includes(data.tagName);
        });
        return { collection };
    });
    const searchTag = { execute, name: 'searchTag' };
    const service = function () {
        return searchTag;
    };
    sp().service(constants_1.TAGS_MODULE.searchTag, service);
    return searchTag;
}
exports.default = init;
//# sourceMappingURL=search-tag.js.map