import * as Promise from 'bluebird';
import { COMMENTS_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

const resolveCommentsIpfsHashS = {
  id: '/resolveCommentsIpfsHash',
  type: 'array',
  items: {
    type: 'string',
    format: 'multihash',
  },
  uniqueItems: true,
  minItems: 1,
};

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data: string[], cb: any) {
    const v = new getService(CORE_MODULE.VALIDATOR_SCHEMA).Validator();
    v.validate(data, resolveCommentsIpfsHashS, { throwError: true });
    const getCommentContent = getService(COMMENTS_MODULE.commentIpfs).getCommentContent;
    for (const ipfsHash of data) {
      getCommentContent(ipfsHash)
        .then((result) => cb('', Object.assign({}, result, { ipfsHash })));
    }
    return {};
  });

  const resolveCommentsIpfsHash = { execute, name: 'resolveCommentsIpfsHash', hasStream: true };
  const service = function () {
    return resolveCommentsIpfsHash;
  };
  sp().service(COMMENTS_MODULE.resolveCommentsIpfsHash, service);
  return resolveCommentsIpfsHash;
}
