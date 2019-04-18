import * as Promise from 'bluebird';
import { GETH_MODULE } from '@akashaproject/common/constants';

export default function init (sp, getService) {
  const execute = Promise.coroutine(function* () {
    yield (getService(GETH_MODULE.stop)).execute();
    yield Promise.delay(500);
    return (getService(GETH_MODULE.startService)).execute();
  });
  const restartService = { execute, name: 'restartService' };
  const service = function () {
    return restartService;
  };
  sp().service(GETH_MODULE.restartService, service);
  return restartService;
}
