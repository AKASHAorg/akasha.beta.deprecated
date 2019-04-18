import * as Promise from 'bluebird';
import { AUTH_MODULE, COMMON_MODULE, CORE_MODULE } from './constants';

const loginS = {
  id: '/loginWeb',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    rememberTime: { type: 'number' },
  },
  required: ['ethAddress'],
};

export default function init (sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, loginS, { throwError: true });

    return getService(AUTH_MODULE.auth).login(data.ethAddress, data.rememberTime);
  });

  const login = { execute, name: 'login' };
  const service = function () {
    return login;
  };
  sp().service(COMMON_MODULE.login, service);
  return login;
}
