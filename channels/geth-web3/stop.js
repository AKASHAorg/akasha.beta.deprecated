import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const web3Api = getService(CORE_MODULE.WEB3_API);
        if (web3Api.instance) {
            web3Api.instance.reset();
        }
        return { stopped: true };
    });
    const stopService = { execute, name: 'stopService' };
    const service = function () {
        return stopService;
    };
    sp().service(GETH_MODULE.stop, service);
    return stopService;
}
//# sourceMappingURL=stop.js.map