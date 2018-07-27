"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const getScore = {
    id: '/getScore',
    type: 'object',
    properties: {
        entryId: { type: 'string' },
    },
    required: ['entryId'],
};
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, getScore, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const score = yield contracts.instance.Votes.getRecord(data.entryId);
        const fetched = yield contracts.fromEvent(contracts.instance.Votes.Vote, { target: data.entryId, voteType: 0 }, 0, 10000, { lastIndex: 0, reversed: true });
        const downVotes = [];
        fetched.results.forEach((event) => {
            if (event.args.negative) {
                downVotes.push(event.args.weight.toNumber());
            }
        });
        const downVotesSum = downVotes.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        const finalScore = (score[1]).toNumber();
        let ratio = -1;
        if ((score[0].toNumber())) {
            const upVotesSum = finalScore + downVotesSum;
            ratio = upVotesSum / (upVotesSum + downVotesSum);
        }
        return { score: finalScore, upvoteRatio: ratio.toFixed(2), entryId: data.entryId };
    });
    const getVoteRatio = { execute, name: 'getVoteRatio' };
    const service = function () {
        return getVoteRatio;
    };
    sp().service(constants_1.ENTRY_MODULE.getVoteRatio, service);
    return getVoteRatio;
}
exports.default = init;
//# sourceMappingURL=vote-ratio.js.map