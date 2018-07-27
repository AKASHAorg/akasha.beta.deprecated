"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.existsSchema = {
    id: '/existsSchema',
    type: 'object',
    properties: {
        tagName: { type: 'string' },
    },
    required: ['tagName'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.existsSchema, { throwError: true });
        const exists = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Tags.exists(data.tagName);
        return { exists, tagName: data.tagName };
    });
    const existsTag = { execute, name: 'exists' };
    const service = function () {
        return existsTag;
    };
    sp().service(constants_1.TAGS_MODULE.existsTag, service);
    return existsTag;
}
exports.default = init;
//# sourceMappingURL=exists-tag.js.map