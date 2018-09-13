import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const transformEssence = {
  id: '/transformEssence',
  type: 'object',
  properties: {
    amount: { type: 'string' },
    token: { type: 'string' },
  },
  required: ['amount', 'token'],
};
export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data, cb) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, transformEssence, { throwError: true });

    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);

    const bnAmount = web3Api.instance.toWei(data.amount, 'ether');
    const txData = contracts.instance.Essence.transformEssence
    .request(bnAmount, { gas: 100000 });

    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
  });
  const transformEssenceService = { execute, name: 'transformEssence', hasStream: true };
  const service = function () {
    return transformEssenceService;
  };
  sp().service(PROFILE_MODULE.transformEssence, service);
  return transformEssenceService;
}
