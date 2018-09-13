"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.manaBurnedSchema = {
    id: '/manaBurned',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
    },
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.manaBurnedSchema, { throwError: true });
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const BN = web3Api.instance.BigNumber;
        const address = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const totalEntries = yield contracts.instance.Entries.getEntryCount(address);
        const entryCost = yield contracts.instance.Entries.required_essence();
        const totalEntriesMana = entryCost.times(new BN(totalEntries));
        const totalComments = yield contracts.instance.Comments.totalCommentsOf(address);
        const commentCost = yield contracts.instance.Comments.required_essence();
        const totalCommentsMana = commentCost.times(totalComments);
        const totalVotes = yield contracts.instance.Votes.totalVotesOf(address);
        const voteCost = yield contracts.instance.Votes.required_essence();
        const votesMana = voteCost.times(totalVotes[0]);
        return {
            entries: {
                totalEntries: totalEntries.toNumber(),
                manaCost: (web3Api.instance.fromWei(totalEntriesMana, 'ether')).toFormat(5),
            },
            comments: {
                totalComments: totalComments.toNumber(),
                manaCost: (web3Api.instance.fromWei(totalCommentsMana, 'ether')).toFormat(5),
            },
            votes: {
                totalVotes: (totalVotes[0].times(totalVotes[1])).toNumber(),
                manaCost: (web3Api.instance.fromWei(votesMana, 'ether')).toFormat(5),
            },
        };
    });
    const manaBurned = { execute, name: 'manaBurned' };
    const service = function () {
        return manaBurned;
    };
    sp().service(constants_1.PROFILE_MODULE.manaBurned, service);
    return manaBurned;
}
exports.default = init;
//# sourceMappingURL=mana-burned.js.map