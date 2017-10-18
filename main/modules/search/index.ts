import query from './query';
import flush from './clear-index';
import syncTags from './sync-tags';
import findTags from './find-tags';
import syncEntries from './sync-entries';

export default [query, flush, syncTags, findTags, syncEntries];
