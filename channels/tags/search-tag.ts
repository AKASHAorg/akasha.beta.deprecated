import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export const searchTagSchema = {
  id: '/searchTag',
  type: 'object',
  properties: {
    tagName: { type: 'string', minLength: 2 },
    limit: { type: 'number' },
  },
  required: ['tagName', 'limit'],
};

export const cacheKey = 'search:tags:all';

export default function init(sp, getService) {
  const execute = Promise
    .coroutine(function* (data: { tagName: string, limit: number }) {
      const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
      v.validate(data, searchTagSchema, { throwError: true });
      const stash = getService(CORE_MODULE.STASH);

      if (!stash.mixed.hasFull(cacheKey)) {
        const filter = getService(CORE_MODULE.CONTRACTS)
          .instance.Tags.TagCreate({}, { fromBlock: 0, toBlock: 'latest' });

        yield Promise
          .fromCallback((cb) => filter.get(cb)).then((collection) => {
            const tags = collection.map((el) => {
              return getService(CORE_MODULE.WEB3_API).instance.toUtf8(el.args.tag);
            });
            stash.mixed.setFull(cacheKey, tags);
            return true;
          });
      }
      const collection = (stash.mixed.getFull(cacheKey)).filter((currentTag) => {
        return currentTag.includes(data.tagName);
      });

      return { collection };
    });

  const searchTag = { execute, name: 'searchTag' };
  const service = function () {
    return searchTag;
  };
  sp().service(TAGS_MODULE.searchTag, service);

  return searchTag;
}
