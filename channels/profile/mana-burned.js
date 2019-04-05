import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
export const manaBurnedSchema = {
    id: '/manaBurned',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
    },
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, manaBurnedSchema, { throwError: true });
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const BN = web3Api.instance.BigNumber;
        const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
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
                manaCost: (web3Api.instance.utils.toBN(web3Api.instance.utils.fromWei(web3Api.instance.utils.toBN(totalEntriesMana), 'ether'))).toNumber(),
            },
            comments: {
                totalComments: totalComments.toNumber(),
                manaCost: (web3Api.instance.utils.toBN(web3Api.instance.utils.fromWei(web3Api.instance.utils.toBN(totalCommentsMana), 'ether'))).toNumber(),
            },
            votes: {
                totalVotes: (totalVotes[0].times(totalVotes[1])).toNumber(),
                manaCost: (web3Api.instance.utils.toBN(web3Api.instance.utils.fromWei(web3Api.instance.utils.toBN(votesMana), 'ether'))).toNumber(),
            },
        };
    });
    const manaBurned = { execute, name: 'manaBurned' };
    const service = function () {
        return manaBurned;
    };
    sp().service(PROFILE_MODULE.manaBurned, service);
    return manaBurned;
}
//# sourceMappingURL=mana-burned.js.map