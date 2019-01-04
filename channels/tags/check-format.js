"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.checkFormatSchema = {
    id: '/checkFormat',
    type: 'object',
    properties: {
        tagName: { type: 'string' },
    },
    required: ['tagName'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.checkFormatSchema, { throwError: true });
        const status = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
            .instance.Tags.checkFormat(data.tagName);
        return { status, tagName: data.tagName };
    });
    const checkFormat = { execute, name: 'checkFormat' };
    const service = function () {
        return checkFormat;
    };
    sp().service(constants_1.TAGS_MODULE.checkFormat, service);
    return checkFormat;
}
exports.default = init;
//# sourceMappingURL=check-format.js.map