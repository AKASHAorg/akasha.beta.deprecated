import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* () {
        const ipfsConnector = getService(CORE_MODULE.IPFS_CONNECTOR);
        return {
            apiPort: (ipfsConnector.getInstance().config.config.Addresses.API) ?
                ipfsConnector.getInstance().config.config.Addresses.API.split('/').pop() : '',
            storagePath: ipfsConnector.getInstance().config.repo,
        };
    });
    const getConfig = { execute, name: 'getConfig' };
    const service = function () {
        return getConfig;
    };
    sp().service(IPFS_MODULE.getConfig, service);
    return getConfig;
}
//# sourceMappingURL=get-config.js.map