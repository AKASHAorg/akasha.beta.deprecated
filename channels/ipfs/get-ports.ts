import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {

    const ports = yield (getService(CORE_MODULE.IPFS_CONNECTOR))
      .getInstance().getPorts();

    return {
      apiPort: ports.api,
      gatewayPort: ports.gateway,
      swarmPort: ports.swarm,
    };
  });
  const getPorts = { execute, name: 'getPorts' };
  const service = function () {
    return getPorts;
  };
  sp().service(IPFS_MODULE.getPorts, service);
  return getPorts;
}
