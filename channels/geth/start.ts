import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';

const startServiceS = {
  id: '/startService',
  type: 'object',
  properties: {
    datadir: { type: 'string' },
    ipcpath: { type: 'string' },
    cache: { type: 'number' },
  },
};
export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, startServiceS, { throwError: true });
    const gethConnector = getService(CORE_MODULE.GETH_CONNECTOR);
    if (gethConnector.getInstance().serviceStatus.process) {
      throw new Error('Geth is already running');
    }
    gethConnector.getInstance().setOptions(data);
    gethConnector.getInstance().enableDownloadEvents();
    // start daemon
    yield gethConnector.getInstance().start();
    return {};
  });

  const startService = { execute, name: 'startService' };
  const service = function () {
    return startService;
  };
  sp().service(GETH_MODULE.startService, service);
  return startService;
}
