import * as Promise from 'bluebird';
import { CORE_MODULE, TX_MODULE } from '@akashaproject/common/constants';

export const getTransactionSchema = {
  id: '/getTransaction',
  type: 'object',
  properties: {
    transactionHash: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['transactionHash'],

};

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, getTransactionSchema, { throwError: true });
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const requests = data.transactionHash.map((txHash) => {
      return web3Api
      .instance.eth
      .getTransactionReceipt(txHash).then((receipt) => {
        if (receipt) {
          return Object.assign(
            {},
            receipt,
            { success: receipt.status === '0x1' });
        }
        return web3Api.instance.eth
        .getTransaction(txHash)
        .then((txHashData) => {
          if (txHashData) {
            return { transactionHash: txHash, blockNumber: null };
          }
          return null;
        });
      });
    });
    return Promise.all(requests);
  });

  const getTransaction = { execute, name: 'getTransaction' };
  const service = function () {
    return getTransaction;
  };
  sp().service(TX_MODULE.getTransaction, service);

  return getTransaction;
}
