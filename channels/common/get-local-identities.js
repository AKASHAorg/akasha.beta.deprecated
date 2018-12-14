import * as Promise from 'bluebird';
import { uniq } from 'ramda';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from './constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const resolveEth = getService(PROFILE_MODULE.getByAddress);
        const accounts = yield web3Api.instance.eth.getAccounts();
        if (!accounts || !accounts.length) {
            return { collection: [] };
        }
        const profiles = uniq(accounts).map((address) => {
            return resolveEth.execute({ ethAddress: address });
        });
        const collection = yield Promise.all(profiles);
        return { collection: collection || [] };
    });
    const getLocalIdentities = { execute, name: 'getLocalIdentities' };
    const service = function () {
        return getLocalIdentities;
    };
    sp().service(COMMON_MODULE.getLocalIdentities, service);
    return getLocalIdentities;
}
//# sourceMappingURL=get-local-identities.js.map