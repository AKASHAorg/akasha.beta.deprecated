import * as Promise from 'bluebird';
import { getLicence } from './list';
import { LICENCE_MODULE } from '@akashaproject/common/constants';

export default function init (sp, getService) {
  const execute = Promise
    .coroutine(function* (data: { id: string | number }) {
      return { license: getLicence(data.id) };
    });
  const getLicenceById = { execute, name: 'getLicenceById' };
  const service = function () {
    return getLicenceById;
  };
  sp().service(LICENCE_MODULE.getLicenceById, service);
  return getLicenceById;
}
