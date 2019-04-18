import * as Promise from 'bluebird';

import { COMMENTS_MODULE, CORE_MODULE, GENERAL_SETTINGS } from '@akashaproject/common/constants';

export default function init (sp, getService) {
  const create = function create (data) {
    const date = (new Date()).toJSON();
    const constructed = {
      date,
      content: data,
    };
    return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
      .add(constructed)
      .then((result: any) => result.hash);
  };

  const getCommentContent = function getCommentContent (hash) {
    const comments = (getService(CORE_MODULE.STASH)).comments;
    if (comments.hasFull(hash)) {
      return Promise.resolve(comments.getFull(hash));
    }
    return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
      .get(hash)
      .timeout((getService(CORE_MODULE.SETTINGS)).get(GENERAL_SETTINGS.FULL_WAIT_TIME))
      .then((data) => {
        comments.setFull(hash, data);
        return data;
      }).catch((e) => {
        return { content: null };
      });
  };

  const commentIpfs = { create, getCommentContent };
  const service = function () {
    return commentIpfs;
  };
  sp().service(COMMENTS_MODULE.commentIpfs, service);
}
