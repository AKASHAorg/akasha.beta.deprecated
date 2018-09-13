"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const watchComments = {
    id: '/watchComments',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        fromBlock: { type: 'number' },
    },
};
const EVENT_TYPE = 'COMMENT_EVENT';
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, watchComments, { throwError: true });
        const ethAddress = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const entriesCache = getService(constants_1.NOTIFICATIONS_MODULE.entriesCache);
        const queue = getService(constants_1.NOTIFICATIONS_MODULE.queue);
        if (!entriesCache.getAll().length) {
            const fetchedEntries = yield contracts
                .fromEvent(contracts.instance.Entries.Publish, { author: ethAddress }, 0, 1000, { lastIndex: 0, reversed: true });
            for (const event of fetchedEntries.results) {
                yield entriesCache.push(event.args.entryId);
            }
        }
        const commentEvent = contracts
            .createWatcher(contracts.instance.Comments.Publish, {}, data.fromBlock);
        commentEvent.watch((err, ev) => {
            if (err) {
                return;
            }
            if (entriesCache.has(ev.args.entryId) && ev.args.author !== ethAddress) {
                queue.push(cb, {
                    type: EVENT_TYPE,
                    payload: ev.args,
                    blockNumber: ev.blockNumber,
                });
            }
        });
        return commentEvent;
    });
    const service = function () {
        return execute;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.comments, service);
    return execute;
}
exports.default = init;
//# sourceMappingURL=comments.js.map