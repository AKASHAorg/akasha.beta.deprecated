"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const cost = yield index_1.constructed.instance.votes.getVoteCost(data.weight);
    return { cost, weight: data.weight };
});
exports.default = { execute, name: 'voteCost' };
//# sourceMappingURL=vote-cost.js.map