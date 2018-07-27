import canCreateInit from './can-create';
import checkFormatInit from './check-format';
import createTagInit from './create-tag';
import existsTagInit from './exists-tag';
import fetchTagsInit from './fetch-tags';
import tagCountInit from './tag-count';
import tagIteratorInit from './tags-iterator';
import searchTagInit from './search-tag';
import syncTagsInit from './sync-tags';

export const moduleName = 'tags';
const init = function init(sp, getService) {

  const canCreate = canCreateInit(sp, getService);
  const checkFormat = checkFormatInit(sp, getService);
  const createTag = createTagInit(sp, getService);
  const existsTag = existsTagInit(sp, getService);
  const fetchTags = fetchTagsInit(sp, getService);
  const tagCount = tagCountInit(sp, getService);
  const tagIterator = tagIteratorInit(sp, getService);
  const searchTag = searchTagInit(sp, getService);

  const syncTags = syncTagsInit(sp, getService);

  return {
    canCreate,
    checkFormat,
    createTag,
    existsTag,
    fetchTags,
    tagCount,
    tagIterator,
    searchTag,
    syncTags,
  };

};

const app = {
  init,
  moduleName,
};

export default app;
