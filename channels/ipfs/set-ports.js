import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        return (getService(CORE_MODULE.IPFS_CONNECTOR))
            .getInstance().setPorts(data.ports, data.restart);
    });
    const setPorts = { execute, name: 'setPorts' };
    const service = function () {
        return setPorts;
    };
    sp().service(IPFS_MODULE.setPorts, service);
    return setPorts;
}
//# sourceMappingURL=set-ports.js.map