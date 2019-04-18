import canCreateInit from './can-create';
import checkFormatInit from './check-format';
import createTagInit from './create-tag';
import existsTagInit from './exists-tag';
import fetchTagsInit from './fetch-tags';
import tagCountInit from './tag-count';
import tagIteratorInit from './tags-iterator';
import searchTagInit from './search-tag';
import syncTagsInit from './sync-tags';
import { TAGS_MODULE } from '@akashaproject/common/constants';

const init = function init (sp, getService) {

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
    [TAGS_MODULE.canCreate]: canCreate,
    [TAGS_MODULE.checkFormat]: checkFormat,
    [TAGS_MODULE.createTag]: createTag,
    [TAGS_MODULE.existsTag]: existsTag,
    [TAGS_MODULE.fetchTags]: fetchTags,
    [TAGS_MODULE.tagCount]: tagCount,
    [TAGS_MODULE.tagIterator]: tagIterator,
    [TAGS_MODULE.searchTag]: searchTag,
    [TAGS_MODULE.syncTags]: syncTags,
  };

};

const app = {
  init,
  moduleName: TAGS_MODULE.$name,
};

export default app;
