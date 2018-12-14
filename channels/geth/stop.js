import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        yield getService(CORE_MODULE.CONTRACTS).stopAllWatchers();
        yield getService(CORE_MODULE.GETH_CONNECTOR).getInstance().stop();
        getService(CORE_MODULE.CONTRACTS).reset();
        return {};
    });
    const stopService = { execute, name: 'stopService' };
    const service = function () {
        return stopService;
    };
    sp().service(GETH_MODULE.stop, service);
    return stopService;
}
//# sourceMappingURL=stop.js.map