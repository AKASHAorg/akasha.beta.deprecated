import queryInit from './query';
import flushInit from './clear-index';
import findTagsInit from './find-tags';
import findProfilesInit from './find-profiles';
import indexes from './indexes';
import { SEARCH_MODULE } from '@akashaproject/common/constants';

const init = async function init(sp, getService) {
  const query = queryInit(sp, getService);
  const flush = flushInit(sp, getService);
  const findTags = findTagsInit(sp, getService);
  const findProfiles = findProfilesInit(sp, getService);
  indexes(sp);
  return {
    [SEARCH_MODULE.query]: query,
    [SEARCH_MODULE.flush]: flush,
    [SEARCH_MODULE.findTags]: findTags,
    [SEARCH_MODULE.findProfiles]: findProfiles,
  };

};

const app = {
  init,
  moduleName: SEARCH_MODULE.$name,
  async: true,
};

export default app;
