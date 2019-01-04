"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const canClaimS = {
    id: '/canClaim',
    type: 'object',
    properties: {
        entryId: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['entryId'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, canClaimS, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const timeStamp = new Date().getTime() / 1000;
        const requests = data.entryId.map((id) => {
            return contracts.instance.Votes
                .canClaimEntry(id, timeStamp)
                .then((status) => {
                return { status, entryId: id };
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const canClaim = { execute, name: 'canClaim' };
    const service = function () {
        return canClaim;
    };
    sp().service(constants_1.ENTRY_MODULE.canClaim, service);
    return canClaim;
}
exports.default = init;
//# sourceMappingURL=can-claim.js.map