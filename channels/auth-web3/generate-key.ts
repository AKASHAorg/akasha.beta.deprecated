import * as Promise from 'bluebird';
import { AUTH_MODULE } from '@akashaproject/common/constants';
// import Auth from './Auth';

export default function init(sp, getService) {
// this functionality is delegated to Metamask as exposing personal module over rpc is not safe
  const execute = Promise.coroutine(function* (data) {
    // const address = yield Auth.generateKey(data.password);
    // return { address };
    return true;
  });
  const generateEthKey = { execute, name: 'generateEthKey' };
  const service = function () {
    return generateEthKey;
  };
  sp().service(AUTH_MODULE.generateEthKey, service);
  return generateEthKey;
}
