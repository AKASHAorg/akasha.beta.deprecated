import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PINNER_MODULE } from '@akashaproject/common/constants';
import { unpad } from 'ethereumjs-util';

export enum objectType {PROFILE = 1, ENTRY = 2, COMMENT = 3}

export enum operationType {ADD = 1, REMOVE = 2}

export default function init(sp, getService) {
  const execute = Promise
    .coroutine(function* (data: { type: objectType, id: any, operation: operationType }) {
      let hashRoot;
      switch (data.type) {
        case objectType.PROFILE:
          // here id is ethAddress
          const profileHex = yield getService(CORE_MODULE.CONTRACTS)
            .instance.ProfileResolver.reverse(data.id);

          if (!!unpad(profileHex)) {
            const [, , , fn, digestSize, hash] = yield getService(CORE_MODULE.CONTRACTS)
              .instance.ProfileResolver.resolve(profileHex);
            hashRoot = getService(COMMON_MODULE.ipfsHelpers)
              .encodeHash(fn, digestSize, hash);
          }
          break;
        case objectType.ENTRY:
          const [fnE, digestSizeE, hashE] = yield getService(CORE_MODULE.CONTRACTS)
            .instance.Entries.getEntry(data.id.ethAddress, data.id.entryId);

          hashRoot = getService(COMMON_MODULE.ipfsHelpers)
            .encodeHash(fnE, digestSizeE, hashE);
          break;
        case objectType.COMMENT:
          const [, , , , fnC, digestSizeC, hashC] = yield getService(CORE_MODULE.CONTRACTS)
            .instance.Comments.getComment(data.id.entryId, data.id.commentId);

          hashRoot = getService(COMMON_MODULE.ipfsHelpers)
            .encodeHash(fnC, digestSizeC, hashC);
          break;
        default:
          throw new Error('No known type specified');
      }
      const pin = yield Promise.fromCallback((cb) => {
        if (data.operation === operationType.REMOVE) {
          return getService(CORE_MODULE.IPFS_CONNECTOR)
            .getInstance().api.apiClient.pin.rm(hashRoot, { recursive: true }, cb);
        }

        if (data.operation === operationType.ADD) {
          return getService(CORE_MODULE.IPFS_CONNECTOR)
            .getInstance().api.apiClient.pin.add(hashRoot, { recursive: true }, cb);
        }
        throw new Error('Operation for pinning not specified');
      });

      return { pin, id: data.id };
    });

  const pin = { execute, name: 'pin' };
  const service = function () {
    return pin;
  };
  sp().service(PINNER_MODULE.pin, service);
  return pin;
}
