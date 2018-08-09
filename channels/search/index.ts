import queryInit from './query';
import flushInit from './clear-index';
import findTagsInit from './find-tags';
import findProfilesInit from './find-profiles';
import indexes from './indexes';

export const moduleName = 'search';
const init = async function init(sp, getService) {
  const query = queryInit(sp, getService);
  const flush = flushInit(sp, getService);
  const findTags = findTagsInit(sp, getService);
  const findProfiles = findProfilesInit(sp, getService);
  indexes(sp);
  return {
    query,
    flush,
    findTags,
    findProfiles,
  };

};

const app = {
  init,
  moduleName,
  async: true,
};

export default app;
