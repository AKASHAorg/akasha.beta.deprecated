import getLicenceByIdInit from './get-licence-by-Id';
import getLicencesInit from './get-licences';

export const moduleName = 'licences';

const init = function init(sp, getService) {
  const getLicenceById = getLicenceByIdInit(sp, getService);
  const getLicences = getLicencesInit(sp, getService);

  return {
    getLicenceById,
    getLicences,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
