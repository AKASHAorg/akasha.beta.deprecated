import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* () {
    const count = yield getService(CORE_MODULE.CONTRACTS).instance.Tags.total();
    return { count: count.toString(10) };
  });

  const tagCount = { execute, name: 'tagCount' };
  const service = function () {
    return tagCount;
  };
  sp().service(TAGS_MODULE.tagCount, service);
  return tagCount;
}
