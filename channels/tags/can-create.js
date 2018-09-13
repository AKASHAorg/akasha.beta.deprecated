"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.canCreateSchema = {
    id: '/canCreate',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
    },
    required: ['ethAddress'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.canCreateSchema, { throwError: true });
        const can = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Tags.canCreate(data.ethAddress);
        return { can };
    });
    const canCreate = { execute, name: 'canCreate' };
    const service = function () {
        return canCreate;
    };
    sp().service(constants_1.TAGS_MODULE.canCreate, service);
    return canCreate;
}
exports.default = init;
//# sourceMappingURL=can-create.js.map