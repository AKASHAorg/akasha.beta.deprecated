import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE, GENERAL_SETTINGS } from '@akashaproject/common/constants';

export const resolveEntriesIpfsHashS = {
  id: '/resolveEntriesIpfsHash',
  type: 'object',
  properties: {
    ipfsHash: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
      minItems: 1,
    },
    full: { type: 'boolean' },
  },
  required: ['ipfsHash'],
};

export default function init (sp, getService) {
  const execute = Promise
    .coroutine(function* (data: { ipfsHash: string[], full?: string }, cb: any) {
      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, resolveEntriesIpfsHashS, { throwError: true });
      const SHORT_WAIT_TIME = (getService(CORE_MODULE.SETTINGS)).get(GENERAL_SETTINGS.OP_WAIT_TIME);
      const { getFullContent, getShortContent } = getService(ENTRY_MODULE.ipfs);
      const fetchData = (data.full) ? getFullContent : getShortContent;
      data.ipfsHash.forEach((ipfsHash) => {
        fetchData(ipfsHash, false)
          .timeout(SHORT_WAIT_TIME)
          .then((entry) => {
            cb(null, { entry, ipfsHash });
          })
          .catch((err) => {
            cb({ ipfsHash, message: err.message });
          });
      });
      return {};
    });

  const resolveEntriesIpfsHash = { execute, name: 'resolveEntriesIpfsHash', hasStream: true };
  const service = function () {
    return resolveEntriesIpfsHash;
  };
  sp().service(ENTRY_MODULE.resolveEntriesIpfsHash, service);
  return resolveEntriesIpfsHash;
}
