import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getComment from './get-comment';

/**
 * Resolve parent comments and send tree structure of comments
 * @type {Function}
 */

const execute = Promise.coroutine(function*(data: { entryId: string, parent: string, limit?: number, start?: number }) {
    let currentId = (data.start) ? data.start : data.parent;
    let firstCommentId = currentId;
    let counter = 0;
    const maxResults = (data.limit) ? data.limit : 5;
    let comment, content, commentInfo, commentContract;
    let results = [];
    let firstTime = true;

    if (currentId === '0') {
        return { collection: [], entryId: data.entryId };
    }

    while (counter < maxResults) {
        currentId = yield contracts.instance.comments.getPrevComment(data.entryId, currentId);
        if (firstTime) {
            currentId = firstCommentId;
            firstTime = false;
        }
        if (currentId === '0') {
            break;
        }
        commentContract = yield contracts.instance.comments.getComment(data.entryId, currentId);
        if (commentContract.parent === data.parent) {
            comment = yield getComment.execute({ entryId: data.entryId, commentId: commentContract.idComment });
            content = JSON.parse(comment.data.content).blocks[0]['text'];
            commentInfo = { commentId: comment.commentId, parentId: comment.data.parent, text: content };
            results.push(commentInfo);
            counter++;
        }
    }

    return { collection: results, entryId: data.entryId, limit: maxResults };
});

export default { execute, name: 'repliesLazy' };