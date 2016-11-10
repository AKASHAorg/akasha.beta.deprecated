import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { getCommentContent } from './ipfs';

/**
 * Get total number of comments for an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string, commentId: string}) {
    const ethData = yield contracts.instance.comments.getComment(data.entryId, data.commentId);
    const content = yield getCommentContent(ethData.ipfsHash);
    return { content: Object.assign(ethData, content), entryId: data.entryId, commentId: data.commentId };
});

export default { execute, name: 'getComment'};
