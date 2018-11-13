import * as Promise from 'bluebird';
import { AUTH_MODULE, COMMON_MODULE, CORE_MODULE, NOTIFICATIONS_MODULE } from './constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    yield (getService(CORE_MODULE.CONTRACTS)).stopAllWatchers();
    yield (getService(NOTIFICATIONS_MODULE.subscribe)).execute(
      {
        settings: { feed: false, donations: false, comments: false, votes: false },
        profile: {}, fromBlock: 0,
      },
      () => {
      });

    (getService(AUTH_MODULE.auth)).logout();
    return { done: true };
  });

  const logout = { execute, name: 'logout' };
  const service = function () {
    return logout;
  };
  sp().service(COMMON_MODULE.logout, service);
  return logout;
}
