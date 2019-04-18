import * as Promise from 'bluebird';
import { filter } from './set-filter';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

export default function init (sp, getService) {

  const execute = Promise
    .coroutine(function* (data: { profiles: string[] }) {
      data.profiles.forEach((profileAddress) => {
        filter.appendAddress(profileAddress);
      });
      return Promise.resolve({ profiles: data.profiles });
    });

  const includeFilter = { execute, name: 'includeFilter' };
  const service = function () {
    return includeFilter;
  };
  sp().service(NOTIFICATIONS_MODULE.includeFilter, service);
  return includeFilter;
}
