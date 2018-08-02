import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const getScore = {
  id: '/getScore',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
  },
  required: ['entryId'],
};

export default function init(sp, getService) {
  const execute = Promise
  .coroutine(function* (data: { entryId: string }) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, getScore, { throwError: true });
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const score = yield contracts.instance.Votes.getRecord(data.entryId);
    const fetched = yield contracts.fromEvent(contracts.instance.Votes.Vote,
      { target: data.entryId, voteType: 0 }, 0, 10000, { lastIndex: 0, reversed: true });
    const downVotes = [];
    fetched.results.forEach((event) => {
      if (event.args.negative) {
        downVotes.push(event.args.weight.toNumber());
      }
    });
    const downVotesSum = downVotes.reduce(
      function (sum, value) {
        return sum + value;
      },
      0,
    );
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
  sp().service(ENTRY_MODULE.getVoteRatio, service);
  return getVoteRatio;
}
