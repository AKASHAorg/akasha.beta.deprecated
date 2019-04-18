import * as Promise from 'bluebird';
import { CORE_MODULE, TX_MODULE } from '@akashaproject/common/constants';

export const addToQueueSchema = {
  id: '/addToQueue',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      tx: { type: 'string' },
    },
    required: ['tx'],
  },
};

export default function init (sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, addToQueueSchema, { throwError: true });

    data.forEach((hash) => {
      (getService(CORE_MODULE.WEB3_HELPER)).addTxToWatch(hash.tx, false);
    });
    (getService(CORE_MODULE.WEB3_HELPER)).startTxWatch();
    return { watching: getService(CORE_MODULE.WEB3_HELPER).watching };
  });

  const addToQueue = { execute, name: 'addToQueue' };
  const service = function () {
    return addToQueue;
  };
  sp().service(TX_MODULE.addToQueue, service);

  return addToQueue;
}
