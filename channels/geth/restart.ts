import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';

const restartServiceS = {
  id: '/restartService',
  type: 'object',
  properties: {
    timer: { type: 'number' },
  },
  required: ['timer'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, restartServiceS, { throwError: true });

    return getService(CORE_MODULE.GETH_CONNECTOR).getInstance().restart(data.timer);
  });

  const restartService = { execute, name: 'restartService' };
  const service = function () {
    return restartService;
  };
  sp().service(GETH_MODULE.restartService, service);
  return restartService;
}
