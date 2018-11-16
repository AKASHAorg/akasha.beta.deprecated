import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data) {
    const entryEth = yield getService(ENTRY_MODULE.getEntryIpfsHash).execute(data);
    const entryIpfs = yield getService(CORE_MODULE.IPFS_CONNECTOR)
      .getInstance().api.get(entryEth.ipfsHash);

    const version = entryIpfs.version || null;
    return { version };
  });

  const getLatestEntryVersion = { execute, name: 'getLatestEntryVersion' };
  const service = function () {
    return getLatestEntryVersion;
  };
  sp().service(ENTRY_MODULE.getLatestEntryVersion, service);
  return getLatestEntryVersion;
}
