"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const constants_1 = require("./constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const resolveEth = getService(constants_1.PROFILE_MODULE.resolveEthAddress);
        const accounts = yield web3Api.instance.eth.getAccountsAsync();
        if (!accounts || !accounts.length) {
            return { collection: [] };
        }
        const profiles = ramda_1.uniq(accounts).map((address) => {
            return resolveEth.execute({ ethAddress: address });
        });
        const collection = yield Promise.all(profiles);
        return { collection: collection || [] };
    });
    const getLocalIdentities = { execute, name: 'getLocalIdentities' };
    const service = function () {
        return getLocalIdentities;
    };
    sp().service(constants_1.AUTH_MODULE.getLocalIdentities, service);
    return getLocalIdentities;
}
exports.default = init;
//# sourceMappingURL=get-local-identities.js.map