"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.getVoteOfS = {
    id: '/getVoteOf',
    type: 'object',
    properties: {
        list: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    entryId: { type: 'string' },
                    akashaId: { type: 'string' },
                    ethAddress: { type: 'string', format: 'address' },
                },
                required: ['entryId'],
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['list'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.getVoteOfS, { throwError: true });
        const profileAddress = getService(constants_1.COMMON_MODULE).profileAddress;
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const requests = data.list.map((req) => {
            return profileAddress(req).then((ethAddress) => {
                return Promise.all([
                    contracts.instance.Votes.voteOf(ethAddress, req.entryId),
                    contracts.instance.Votes.karmaOf(ethAddress, req.entryId),
                ]);
            }).spread((vote, karma) => {
                return Object.assign({}, req, { vote: vote.toString(), essence: (web3Api.instance.fromWei(karma[0])).toFormat(10), claimed: karma[1] });
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const getVoteOf = { execute, name: 'getVoteOf' };
    const service = function () {
        return getVoteOf;
    };
    sp().service(constants_1.ENTRY_MODULE.getVoteOf, service);
    return getVoteOf;
}
exports.default = init;
//# sourceMappingURL=get-vote-of.js.map