"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const getScoreS = {
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
        v.validate(data, getScoreS, { throwError: true });
        const score = yield getService(constants_1.CORE_MODULE.CONTRACTS)
            .instance.Votes.getRecord(data.entryId);
        return { score: (score[1]).toString(10), entryId: data.entryId };
    });
    const getScore = { execute, name: 'getScore' };
    const service = function () {
        return getScore;
    };
    sp().service(constants_1.ENTRY_MODULE.getScore, service);
    return getScore;
}
exports.default = init;
//# sourceMappingURL=entry-score.js.map