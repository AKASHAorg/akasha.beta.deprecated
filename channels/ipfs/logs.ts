import * as Promise from 'bluebird';
import { IPFS_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    throw new Error('Filtering logs is deprecated');
  });

  const logs = { execute, name: 'logs' };
  const service = function () {
    return logs;
  };
  sp().service(IPFS_MODULE.logs, service);
  return logs;
}
