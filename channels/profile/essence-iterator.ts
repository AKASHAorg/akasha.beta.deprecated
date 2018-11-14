import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { addHexPrefix, unpad } from 'ethereumjs-util';

export const essenceIteratorSchema = {
  id: '/essenceIterator',
  type: 'object',
  properties: {
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
    lastBlock: { type: 'number' },
    lastIndex: { type: 'number' },
    limit: { type: 'number' },
    reversed: { type: 'boolean' },
  },
  required: ['lastBlock'],
};
export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, essenceIteratorSchema, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const address = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const toBlock = (!data.lastBlock) ?
      yield web3Api.instance.eth.getBlockNumber() : data.lastBlock;
    const fetched = yield contracts.fromEvent(
      contracts.instance.Essence.CollectEssence,
      { receiver: address },
      toBlock,
      maxResults,
      { lastIndex: data.lastIndex, reversed: data.reversed || false },
    );

    for (const event of fetched.results) {
      collection.push({
        amount: (web3Api.instance.fromWei(event.args.amount, 'ether')).toFormat(5),
        action: web3Api.instance.toUtf8(addHexPrefix(unpad(event.args.action))),
        sourceId: event.args.source,
        blockNumber: event.blockNumber,
      });
    }
    return {
      collection,
      lastBlock: fetched.fromBlock,
      lastIndex: fetched.lastIndex,
      akashaId: data.akashaId,
      limit: maxResults,
    };
  });
  const essenceIterator = { execute, name: 'essenceIterator' };
  const service = function () {
    return essenceIterator;
  };
  sp().service(PROFILE_MODULE.essenceIterator, service);
  return essenceIterator;
}
