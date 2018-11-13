import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise
  .coroutine(function* (data) {
    return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api.get(data.hash);
  });

  const resolve = { execute, name: 'resolve' };
  const service = function () {
    return resolve;
  };
  sp().service(IPFS_MODULE.resolve, service);
  return resolve;
}
