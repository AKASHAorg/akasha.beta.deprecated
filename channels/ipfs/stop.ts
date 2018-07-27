import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    getService(CORE_MODULE.IPFS_CONNECTOR).getInstance().stop();
    yield Promise.delay(50);
    return { stopped: true };
  });

  const stopService = { execute, name: 'stopService' };
  const service = function () {
    return stopService;
  };
  sp().service(IPFS_MODULE.stopService, service);
  return stopService;
}
