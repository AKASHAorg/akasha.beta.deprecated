import generateKeyInit from './generate-key';
import authInit from './Auth';
import regenSessionInit from './regen-session';


export const moduleName = 'auth';

const init = function init(sp, getService) {
  authInit(sp, getService);
  const generateKey = generateKeyInit(sp, getService);
  const regenSession = regenSessionInit(sp, getService);

  return {
    generateKey,
    regenSession,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
