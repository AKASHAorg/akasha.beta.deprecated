"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getTagsCreatedSchema = {
    id: '/getTagsCreated',
    type: 'object',
    properties: {
        fromBlock: { type: 'number' },
        toBlock: { type: 'number' },
    },
    required: ['fromBlock', 'toBlock'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.getTagsCreatedSchema, { throwError: true });
        const event = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Tags.TagCreate(data);
        const collection = yield event.get();
        return { collection };
    });
    const fetchTags = { execute, name: 'getTagsCreated' };
    const service = function () {
        return fetchTags;
    };
    sp().service(constants_1.TAGS_MODULE.fetchTags, service);
    return fetchTags;
}
exports.default = init;
//# sourceMappingURL=fetch-tags.js.map