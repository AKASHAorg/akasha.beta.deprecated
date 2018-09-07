import logsInit from './logs';
import optionsInit from './options';
import restartInit from './restart';
import startInit from './start';
import statusInit from './status';
import stopInit from './stop';
import syncStatusInit from './sync-status';
import { GETH_MODULE } from '@akashaproject/common/constants';

const init = function init(sp, getService) {
  const logs = logsInit(sp, getService);
  const options = optionsInit(sp, getService);
  const restart = restartInit(sp, getService);
  const start = startInit(sp, getService);
  const status = statusInit(sp, getService);
  const stop = stopInit(sp, getService);
  const syncStatus = syncStatusInit(sp, getService);

  return {
    [GETH_MODULE.logs]: logs,
    [GETH_MODULE.options]: options,
    [GETH_MODULE.restartService]: restart,
    [GETH_MODULE.start]: start,
    [GETH_MODULE.status]: status,
    [GETH_MODULE.stop]: stop,
    [GETH_MODULE.syncStatus]: syncStatus,
  };
};

const app = {
  init,
  moduleName: GETH_MODULE.$name,
};

export default app;
