import createImageInit from './create-image';
import getConfigInit from './get-config';
import getPortsInit from './get-ports';
import logsInit from './logs';
import resolveInit from './resolve';
import setPortsInit from './set-ports';
import startInit from './start';
import statusInit from './status';
import stopInit from './stop';

export const moduleName = 'ipfs';

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
    createImage,
    getConfig,
    getPorts,
    logs,
    resolve,
    setPorts,
    start,
    status,
    stop,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
