import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    return Promise.fromCallback((cb) => {
      return getService(CORE_MODULE.IPFS_CONNECTOR)
        .getInstance().logger.query({ start: 0, limit: 10, order: 'desc' }, cb);
    });
  });

  const logs = { execute, name: 'logs' };
  const service = function () {
    return logs;
  };
  sp().service(IPFS_MODULE.logs, service);
  return logs;
}
