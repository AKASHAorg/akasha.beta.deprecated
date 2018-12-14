import createImageInit from './create-image';
import getConfigInit from './get-config';
import getPortsInit from './get-ports';
import logsInit from './logs';
import resolveInit from './resolve';
import setPortsInit from './set-ports';
import startInit from './start';
import statusInit from './status';
import stopInit from './stop';
import { IPFS_MODULE } from '@akashaproject/common/constants';
const init = function init(sp, getService) {
    const createImage = createImageInit(sp, getService);
    const getConfig = getConfigInit(sp, getService);
    const getPorts = getPortsInit(sp, getService);
    const logs = logsInit(sp, getService);
    const resolve = resolveInit(sp, getService);
    const setPorts = setPortsInit(sp, getService);
    const start = startInit(sp, getService);
    const status = statusInit(sp, getService);
    const stop = stopInit(sp, getService);
    return {
        [IPFS_MODULE.createImage]: createImage,
        [IPFS_MODULE.getConfig]: getConfig,
        [IPFS_MODULE.getPorts]: getPorts,
        [IPFS_MODULE.logs]: logs,
        [IPFS_MODULE.resolve]: resolve,
        [IPFS_MODULE.setPorts]: setPorts,
        [IPFS_MODULE.startService]: start,
        [IPFS_MODULE.status]: status,
        [IPFS_MODULE.stopService]: stop,
    };
};
const app = {
    init,
    moduleName: IPFS_MODULE.$name,
};
export default app;
//# sourceMappingURL=index.js.map