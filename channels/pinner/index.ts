import runnerInit from './runner';

export const moduleName = 'pinner';

const init = function init(sp, getService) {
  const runner = runnerInit(sp, getService);
  return { runner };
};
const app = {
  init,
  moduleName,
};

export default app;
