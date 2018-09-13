import * as Promise from 'bluebird';
import { Buffer } from 'safe-buffer';
import { AUTH_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

const generateEthKeyS = {
  id: '/generateEthKey',
  type: 'object',
  properties: {
    password: { type: 'any', format: 'buffer' },
    password1: { type: 'any', format: 'buffer' },
  },
  required: ['password', 'password1'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, generateEthKeyS, { throwError: true });

    if (!(Buffer.from(data.password)).equals(Buffer.from(data.password1))) {
      throw new Error('auth:generate-key:pwdm');
    }
    const address = yield getService(AUTH_MODULE.auth).generateKey(data.password);
    return { address };
  });

  const generateEthKey = { execute, name: 'generateEthKey' };
  const service = function () {
    return generateEthKey;
  };
  sp().service(AUTH_MODULE.generateEthKey, service);
  return generateEthKey;
}
