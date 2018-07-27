import generateKeyInit from './generate-key';
import authInit from './Auth';

export const moduleName = 'auth';

const init = function init(sp, getService) {
  authInit(sp, getService);
  const generateKey = generateKeyInit(sp, getService);

  return {
    generateKey,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
