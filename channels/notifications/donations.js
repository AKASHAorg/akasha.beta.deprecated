"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const watchDonate = {
    id: '/watchDonate',
    type: 'object',
    properties: {
        akashaId: { type: 'string' },
        ethAddress: { type: 'string', format: 'address' },
        fromBlock: { type: 'number' },
    },
};
const EVENT_TYPE = 'DONATION_EVENT';
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, watchDonate, { throwError: true });
        const ethAddress = yield getService(constants_1.COMMON_MODULE.profileHelpers).profileAddress(data);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const queue = getService(constants_1.NOTIFICATIONS_MODULE.queue);
        const donateEvent = contracts
            .createWatcher(contracts.instance.AETH.Donate, { to: ethAddress }, data.fromBlock);
        donateEvent.watch((err, ev) => {
            if (!err) {
                queue.push(cb, {
                    type: EVENT_TYPE,
                    payload: {
                        from: ev.args.from,
                        aeth: (web3Api.instance.fromWei(ev.args.aeth, 'ether')).toFormat(5),
                        eth: (web3Api.instance.fromWei(ev.args.eth, 'ether')).toFormat(5),
                        message: ev.args.extraData,
                    },
                    blockNumber: ev.blockNumber,
                });
            }
        });
        return donateEvent;
    });
    const service = function () {
        return execute;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.donations, service);
    return execute;
}
exports.default = init;
//# sourceMappingURL=donations.js.map