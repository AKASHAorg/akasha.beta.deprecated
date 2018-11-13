import * as Promise from 'bluebird';
import { COMMENTS_MODULE, CORE_MODULE } from '@akashaproject/common/constants';
const getScoreS = {
    id: '/getScore',
    type: 'object',
    properties: {
        commentId: { type: 'string' },
    },
    required: ['commentId'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, getScoreS, { throwError: true });
        const score = yield contracts.instance.Votes.getRecord(data.commentId);
        return { score: (score[1]).toString(10), commentId: data.commentId };
    });
    const getScore = { execute, name: 'getScore' };
    const service = function () {
        return getScore;
    };
    sp().service(COMMENTS_MODULE.getScore, service);
    return getScore;
}
//# sourceMappingURL=get-score.js.map