import * as Promise from 'bluebird';
import { IPFS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        return {};
    });
    const status = { execute, name: 'status' };
    const service = function () {
        return status;
    };
    sp().service(IPFS_MODULE.status, service);
    return status;
}
//# sourceMappingURL=status.js.map