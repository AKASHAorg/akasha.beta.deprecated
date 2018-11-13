import * as Promise from 'bluebird';
import { isEmpty } from 'ramda';
import { CORE_MODULE, GENERAL_SETTINGS, IPFS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const ipfsConnector = getService(CORE_MODULE.IPFS_CONNECTOR);
        const ipfsProvider = getService(CORE_MODULE.IPFS_PROVIDER);
        if (ipfsConnector.getInstance().serviceStatus.process) {
            console.warn('IPFS is already running');
            return { started: true };
        }
        ipfsConnector.getInstance()
            .setIpfsFolder(data.hasOwnProperty('storagePath') ?
            data.storagePath :
            getService(CORE_MODULE.SETTINGS).get(GENERAL_SETTINGS.IPFS_DEFAULT_PATH));
        yield ipfsConnector.getInstance().start(isEmpty(ipfsProvider.instance) ?
            null : ipfsProvider.instance);
        (getService(CORE_MODULE.SETTINGS))
            .set(GENERAL_SETTINGS.BASE_URL, 'https://gateway.ipfs.io/ipfs/');
        return { started: true };
    });
    const startService = { execute, name: 'startService' };
    const service = function () {
        return startService;
    };
    sp().service(IPFS_MODULE.startService, service);
    return startService;
}
//# sourceMappingURL=start.js.map