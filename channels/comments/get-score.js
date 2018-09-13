"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const getScoreS = {
    id: '/getScore',
    type: 'object',
    properties: {
        commentId: { type: 'string' },
    },
    required: ['commentId'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, getScoreS, { throwError: true });
        const score = yield contracts.instance.Votes.getRecord(data.commentId);
        return { score: (score[1]).toString(10), commentId: data.commentId };
    });
    const getScore = { execute, name: 'getScore' };
    const service = function () {
        return getScore;
    };
    sp().service(constants_1.COMMENTS_MODULE.getScore, service);
    return getScore;
}
exports.default = init;
//# sourceMappingURL=get-score.js.map