"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const watchFollow = {
    id: '/watchFollow',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        fromBlock: { type: 'number' },
    },
};
const EVENT_TYPE = 'FOLLOWING_EVENT';
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, watchFollow, { throwError: true });
        const ethAddress = yield (getService(constants_1.COMMON_MODULE.profileHelpers)).profileAddress(data);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const queue = getService(constants_1.NOTIFICATIONS_MODULE.queue);
        const followEvent = contracts
            .createWatcher(contracts.instance.Feed.Follow, { followed: ethAddress }, data.fromBlock);
        followEvent.watch((err, ev) => {
            if (!err) {
                queue.push(cb, { type: EVENT_TYPE, payload: ev.args, blockNumber: ev.blockNumber });
            }
        });
        return followEvent;
    });
    const service = function () {
        return execute;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.feed, service);
    return execute;
}
exports.default = init;
//# sourceMappingURL=feed.js.map