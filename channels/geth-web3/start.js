import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const web3Api = getService(CORE_MODULE.WEB3_API);
        let connected = web3Api.instance.isConnected();
        connected = web3Api.instance.isConnected();
        yield (getService(CORE_MODULE.CONTRACTS)).init();
        return { started: connected };
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(GETH_MODULE.startService, service);
    return startService;
}
//# sourceMappingURL=start.js.map