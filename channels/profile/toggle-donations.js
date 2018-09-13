"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.toggleDonations = {
    id: '/toggleDonations',
    type: 'object',
    properties: {
        status: { type: 'boolean' },
        token: { type: 'string' },
    },
    required: ['token', 'status'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, exports.toggleDonations, { throwError: true });
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        const currentProfile = yield getService(constants_1.PROFILE_MODULE.getCurrentProfile).execute();
        if (!currentProfile.raw) {
            throw new Error('Need to register an akashaId to access this setting.');
        }
        const txData = contracts.instance
            .ProfileResolver
            .toggleDonations
            .request(currentProfile.raw, data.status, { gas: 200000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return {
            tx: transaction.tx,
            receipt: transaction.receipt,
        };
    });
    const toggleDonationsService = { execute, name: 'toggleDonations', hasStream: true };
    const service = function () {
        return toggleDonationsService;
    };
    sp().service(constants_1.PROFILE_MODULE.toggleDonations, service);
    return toggleDonationsService;
}
exports.default = init;
//# sourceMappingURL=toggle-donations.js.map