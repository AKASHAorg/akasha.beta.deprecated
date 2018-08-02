"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const canClaimVoteS = {
    id: '/canClaim',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        entries: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['ethAddress', 'entries'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, canClaimVoteS, { throwError: true });
        const timeStamp = new Date().getTime() / 1000;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const requests = data.entries.map((id) => {
            return contracts.instance.Votes
                .canClaimEntryVote(id, data.ethAddress, timeStamp)
                .then((status) => {
                return { entryId: id, status };
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const canClaimVote = { execute, name: 'canClaimVote' };
    const service = function () { return canClaimVote; };
    sp().service(constants_1.ENTRY_MODULE.canClaimVote, service);
    return canClaimVote;
}
exports.default = init;
//# sourceMappingURL=can-claim-vote.js.map