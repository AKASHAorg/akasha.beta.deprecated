"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getVoteOfSchema = {
    id: '/getVoteOf',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            commentId: { type: 'string' },
            akashaId: { type: 'string' },
            ethAddress: { type: 'string', format: 'address' },
        },
        required: ['commentId'],
    },
    uniqueItems: true,
    minItems: 1,
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.getVoteOfSchema, { throwError: true });
        const profileAddress = (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const requests = data.map((req) => {
            return profileAddress(req).then((ethAddress) => {
                return contracts.instance.Votes.voteOf(ethAddress, req.commentId);
            }).then((vote) => {
                return Object.assign({}, req, { vote: vote.toString(10) });
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const getVoteOf = { execute, name: 'getVoteOf' };
    const service = function () {
        return getVoteOf;
    };
    sp().service(constants_1.COMMENTS_MODULE.getVoteOf, service);
    return getVoteOf;
}
exports.default = init;
//# sourceMappingURL=vote-of.js.map