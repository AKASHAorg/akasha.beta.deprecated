"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const index_2 = require('../auth/index');
const runner_1 = require('../pinner/runner');
const records_1 = require('../models/records');
const execute = Promise.coroutine(function* (data) {
    const txData = yield index_1.constructed.instance.feed.follow(data.akashaId, data.gas);
    const tx = yield index_2.module.auth.signData(txData, data.token);
    records_1.mixed.flush();
    runner_1.default.execute({ type: runner_1.ObjectType.PROFILE, id: data.akashaId, operation: runner_1.OperationType.ADD });
    return { tx, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'followProfile' };
//# sourceMappingURL=follow-profile.js.map