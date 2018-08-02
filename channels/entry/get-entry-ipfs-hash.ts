import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
import { COMMON_MODULE, CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const getEntryIpfsHashS = {
  id: '/getEntryIpfsHash',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    akashaId: { type: 'string' },
  },
  required: ['entryId'],
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, getEntryIpfsHashS, { throwError: true });

    let ipfsHash;
    const ethAddress = yield getService(COMMON_MODULE.profileHelpers).profileAddress(data);
    const [fn, digestSize, hash] = yield getService(CORE_MODULE.CONTRACTS)
    .instance.Entries.getEntry(ethAddress, data.entryId);
    if (!!unpad(hash)) {
      ipfsHash = getService(COMMON_MODULE.ipfsHelpers).encodeHash(fn, digestSize, hash);
    }
    return { ipfsHash };
  });

  const getEntryIpfsHash = { execute, name: 'getEntryIpfsHash' };
  const service = function () {
    return getEntryIpfsHash;
  };
  sp().service(ENTRY_MODULE.getEntryIpfsHash, service);
  return getEntryIpfsHash;
}
