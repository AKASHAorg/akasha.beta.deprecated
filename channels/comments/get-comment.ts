import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
import {
  COMMENTS_MODULE,
  COMMON_MODULE,
  CORE_MODULE,
  PROFILE_MODULE,
} from '@akashaproject/common/constants';

export default function init (sp, getService) {
  const execute = Promise.coroutine(
    function* (data: { entryId: string, commentId: string, noResolve?: boolean }) {

      const contracts = getService(CORE_MODULE.CONTRACTS);
      const [
        parent, ethAddress, deleted,
        publishDate, fn, digestSize, hash] = yield contracts.instance
        .Comments.getComment(data.entryId, data.commentId);

      const ipfsHash = (getService(COMMON_MODULE.ipfsHelpers)).encodeHash(fn, digestSize, hash);
      const author = yield (getService(PROFILE_MODULE.resolveEthAddress)).execute({ ethAddress });
      const content = data.noResolve ?
        { ipfsHash } : yield (getService(COMMENTS_MODULE.commentIpfs)).getCommentContent(ipfsHash);

      const [totalVotes, score, endPeriod] = yield contracts
        .instance.Votes.getRecord(data.commentId);

      return Object.assign(
        {},
        content,
        {
          author,
          deleted,
          parent: (!!unpad(parent)) ? parent : null,
          totalVotes: totalVotes.toNumber(),
          score: score.toNumber(),
          endPeriod: endPeriod.toNumber(),
          publishDate: publishDate.toNumber(),
        });
    });

  const getComment = { execute, name: 'getComment' };
  const service = function () {
    return getComment;
  };
  sp().service(COMMENTS_MODULE.getComment, service);
  return getComment;
}
