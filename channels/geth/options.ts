import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';

export default function init (sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const options = (getService(CORE_MODULE.GETH_CONNECTOR)).getInstance().setOptions(data);
    const mapObj = Object.create(null);
    for (const [k, v] of options) {
      mapObj[k] = v;
    }
    return mapObj;
  });

  const options = { execute, name: 'options' };
  const service = function () {
    return options;
  };
  sp().service(GETH_MODULE.options, service);
  return options;
}
