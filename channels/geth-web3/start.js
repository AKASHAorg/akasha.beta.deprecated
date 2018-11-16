import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const helper = getService(CORE_MODULE.WEB3_HELPER);
        const status = yield helper.inSync();
        console.log('status', status);
        yield (getService(CORE_MODULE.CONTRACTS)).init();
        return { started: !!status.length };
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(GETH_MODULE.startService, service);
    return startService;
}
//# sourceMappingURL=start.js.map