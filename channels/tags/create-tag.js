"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.createSchema = {
    id: '/create',
    type: 'object',
    properties: {
        tagName: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['tagName', 'token'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.createSchema, { throwError: true });
        const txData = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Tags.add.request(data.tagName);
        const receipt = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .send(txData, data.token, cb);
        return { receipt, tagName: data.tagName };
    });
    const createTag = { execute, name: 'create', hasStream: true };
    const service = function () {
        return createTag;
    };
    sp().service(constants_1.TAGS_MODULE.createTag, service);
    return createTag;
}
exports.default = init;
//# sourceMappingURL=create-tag.js.map