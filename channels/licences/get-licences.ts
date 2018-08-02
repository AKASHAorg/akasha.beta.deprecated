import * as Promise from 'bluebird';
import { licences } from './list';
import { LICENCE_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise
  .coroutine(function* () {
    return { licences };
  });
  const getLicences = { execute, name: 'getLicences' };
  const service = function () {
    return getLicences;
  };
  sp().service(LICENCE_MODULE.getLicences, service);
  return getLicences;
}
