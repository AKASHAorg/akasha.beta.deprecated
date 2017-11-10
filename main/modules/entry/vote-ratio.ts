import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const getScore = {
    'id': '/getScore',
    'type': 'object',
    'properties': {
        'entryId': {'type': 'string'}
    },
    'required': ['entryId']
};

const execute = Promise.coroutine(function* (data: { entryId: string }) {
    const v = new schema.Validator();
    v.validate(data, getScore, { throwError: true });

    const score = yield contracts.instance.Votes.getRecord(data.entryId);
    const fetched = yield contracts.fromEvent(contracts.instance.Votes.Vote,
        { target: data.entryId, voteType: 0 }, 0, 10000, { lastIndex: 0, reversed: true });
    const downVotes = [];
    fetched.results.forEach((event) => {
        if (event.args.negative) {
            downVotes.push(event.args.weight.toNumber());
        }
    });
    const downVotesSum = downVotes.reduce(function(sum, value) {
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

export default { execute, name: 'getVoteRatio' };
