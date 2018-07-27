import * as Promise from 'bluebird';
import { AUTH_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data: { token: string }) {
    const session = getService(AUTH_MODULE.auth).regenSession(data.token);
    return { session };
  });

  const regenSession = { execute, name: 'regenSession' };
  const service = function () {
    return regenSession;
  };
  sp().service(AUTH_MODULE.regenSession, service);
  return regenSession;
}
