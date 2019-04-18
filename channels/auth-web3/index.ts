import generateKeyInit from './generate-key';
import authInit from './Auth';
import regenSessionInit from './regen-session';
import { AUTH_MODULE } from '@akashaproject/common/constants';

const init = function init (sp, getService) {
  authInit(sp, getService);
  const generateKey = generateKeyInit(sp, getService);
  const regenSession = regenSessionInit(sp, getService);

  return {
    [AUTH_MODULE.generateEthKey]: generateKey,
    [AUTH_MODULE.regenSession]: regenSession,
  };
};

const app = {
  init,
  moduleName: AUTH_MODULE.$name,
};

export default app;
