import * as types from '../constants';
import { action } from './helpers';
import { TAGS_MODULE } from '@akashaproject/common/constants';

export const tagCreate = data => action(`${TAGS_MODULE.createTag}`, { data });

export const tagCanCreate = data => action(`${TAGS_MODULE.canCreate}`, { data });

export const tagExists = data => action(`${TAGS_MODULE.existsTag}`, { data });

export const tagGetEntriesCount = tags => action(`${TAGS_MODULE.tagCount}`, { tags });

export const tagSearch = tagName => action(`${TAGS_MODULE.searchTag}`, { tagName });

export const tagSearchMoreSuccess = (tags, tagCount) =>
    action(types.TAG_SEARCH_MORE_SUCCESS, { tags, tagCount });
