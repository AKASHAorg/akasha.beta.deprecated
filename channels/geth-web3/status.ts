import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    const blockNr = (getService(CORE_MODULE.WEB3_API)).instance.isConnected() ?
      yield (getService(CORE_MODULE.WEB3_API)).instance.eth.getBlockNumber() : false;
    return { blockNr };
  });
  const status = { execute, name: 'status' };
  const service = function () {
    return status;
  };
  sp().service(GETH_MODULE.status, service);
  return status;
}
