import * as Promise from 'bluebird';
import { CORE_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

export const createImage = function createImage(data: Uint8Array, type = 'image/jpg') {
  const blob = new Blob([data], { type });
  return URL.createObjectURL(blob);
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data: string[]) {
    const requests = data.map((hash) => {
      return getService(CORE_MODULE.IPFS_CONNECTOR)
        .getInstance().api.getFile(hash).then((uintData) => {
          return { hash, data: uintData };
        });
    });
    const collection = yield Promise.all(requests);
    const response = collection.map((record) => {
      return { [record.hash]: createImage(record.data) };
    });
    return { collection: response };
  });

  const createImages = { execute, name: 'createImage' };
  const service = function () {
    return createImages;
  };
  sp().service(IPFS_MODULE.createImage, service);
  return createImages;
}
