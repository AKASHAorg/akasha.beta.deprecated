import logsInit from './logs';
import optionsInit from './options';
import restartInit from './restart';
import startInit from './start';
import statusInit from './status';
import stopInit from './stop';
import syncStatusInit from './sync-status';

export const moduleName = 'geth';

const init = function init(sp, getService) {
  const logs = logsInit(sp, getService);
  const options = optionsInit(sp, getService);
  const restart = restartInit(sp, getService);
  const start = startInit(sp, getService);
  const status = statusInit(sp, getService);
  const stop = stopInit(sp, getService);
  const syncStatus = syncStatusInit(sp, getService);

  return {
    logs,
    options,
    restart,
    start,
    status,
    stop,
    syncStatus,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
